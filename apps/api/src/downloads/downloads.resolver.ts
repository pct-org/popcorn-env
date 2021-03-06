import { Args, Parent, Query, ResolveField, Resolver, Mutation } from '@nestjs/graphql'
import { Download } from '@pct-org/types/download'
import { Inject } from '@nestjs/common'
import { formatBytes, formatMsToRemaining } from '@pct-org/torrent/utils'
import { Movie, MoviesService } from '@pct-org/types/movie'
import { Episode, EpisodesService } from '@pct-org/types/episode'

import { DownloadsArgs } from './dto/downloads.args'
import { DownloadArgs } from './dto/download.args'
import { DownloadsService } from './downloads.service'

import { TorrentService } from '../shared/torrent/torrent.service'

@Resolver(of => Download)
export class DownloadsResolver {

  @Inject()
  private readonly downloadsService: DownloadsService

  @Inject()
  private readonly torrentService: TorrentService

  @Inject()
  private readonly moviesService: MoviesService

  @Inject()
  private readonly episodesService: EpisodesService

  @Query(returns => [Download], { description: 'Get all downloads.' })
  public downloads(@Args() downloadsArgs: DownloadsArgs): Promise<Download[]> {
    return this.downloadsService.findAll(downloadsArgs)
  }

  @Query(returns => Download, { description: 'Get one download.', nullable: true })
  public download(@Args() downloadArgs: DownloadArgs): Promise<Download> {
    return this.downloadsService.findOne(downloadArgs._id)
  }

  @Query(returns => [Download], { description: 'Get all active/queued downloads.' })
  public activeDownloads(): Promise<Download[]> {
    return this.downloadsService.findAllWithIds(
      this.torrentService.downloads.map((download) => download._id)
    )
  }

  @Mutation(returns => Download, { description: 'Start downloading a quality.' })
  public async startDownload(
    @Args('_id') _id: string,
    @Args('itemType') itemType: string,
    @Args('quality') quality: string,
    @Args({ name: 'type', defaultValue: TorrentService.TYPE_DOWNLOAD, type: () => String }) type: string,
    @Args({ name: 'torrentType', defaultValue: 'scraped', type: () => String }) torrentType: string
  ): Promise<Download> {
    const downloadExists = await this.download({ _id })

    if (downloadExists) {
      // If the download exists but has status failed then remove everything so we can retry
      if (downloadExists.status === TorrentService.STATUS_FAILED) {
        await this.torrentService.cleanUpDownload(downloadExists, true)

      } else {
        return downloadExists
      }
    }

    const download = await this.downloadsService.addOne({
      _id,
      type,
      itemType,
      torrentType,
      quality
    })

    const item = await this.torrentService.getItemForDownload(download)

    await this.torrentService.updateItemDownload(item, {
      downloadStatus: TorrentService.STATUS_QUEUED,
      downloadQuality: quality,
      downloading: true
    })

    // Add the download to the queue
    this.torrentService.addDownload(download)

    if (type !== TorrentService.TYPE_STREAM) {
      // Start the queue
      this.torrentService.startDownloads()
    }

    return download
  }

  @Mutation(returns => Download, { description: 'Remove an download and its files.', nullable: true })
  public async removeDownload(
    @Args('_id') _id: string,
    @Args({ name: 'type', defaultValue: TorrentService.TYPE_DOWNLOAD, type: () => String }) type: string
  ): Promise<Download> {
    const download = await this.download({ _id })

    if (download) {
      // Only cleanup and update if the stop type is the same as the start type
      if (type === download.type) {
        await this.torrentService.stopDownloading(download)
        await this.torrentService.cleanUpDownload(download, true)

        // Start the other queued items
        this.torrentService.startDownloads()

        const item = await this.torrentService.getItemForDownload(download)

        await this.torrentService.updateItemDownload(item, {
          downloadedOn: null,
          downloadStatus: null,
          downloadQuality: null,
          downloading: false,
          downloadComplete: false
        })

        download.status = TorrentService.STATUS_REMOVED
        download.progress = 0
      }

      return download
    }

    return null
  }

  @Mutation(returns => Download, { description: 'Start a download in stream mode.' })
  public async startStream(
    @Args('_id') _id: string,
    @Args('itemType') itemType: string,
    @Args('quality') quality: string,
    @Args({ name: 'torrentType', defaultValue: 'scraped', type: () => String }) torrentType: string
  ): Promise<Download> {
    let download = await this.download({ _id })

    if (!download || download.status === TorrentService.STATUS_FAILED) {
      download = await this.startDownload(
        _id,
        itemType,
        quality,
        TorrentService.TYPE_STREAM,
        torrentType
      )
    }

    // Check if the download is not complete, downloading or connecting
    if (![
      TorrentService.STATUS_CONNECTING,
      TorrentService.STATUS_COMPLETE,
      TorrentService.STATUS_DOWNLOADING
    ].includes(download.status)) {
      this.torrentService.startStreaming(download)
    }

    return download
  }

  @Mutation(returns => Download, { description: 'Stop a stream and remove downloaded content.' })
  public async stopStream(@Args('_id') _id: string): Promise<Download> {
    return this.removeDownload(_id, TorrentService.TYPE_STREAM)
  }

  /**
   * Fetch the movie of this download
   *
   * @param {Download} download - The download to fetch the movie for
   */
  @ResolveField(type => Movie, { description: 'The movie of this download, only if itemType === "movie".' })
  public movie(@Parent() download): Promise<Movie> {
    if (download.itemType !== 'movie') {
      return null
    }

    return this.moviesService.findOne(download._id)
  }

  /**
   * Fetch the episode of this download
   */
  @ResolveField(type => Episode, { description: 'The episode of this download, only if itemType === "episode".' })
  public episode(@Parent() download: Download): Promise<Episode> {
    if (download.itemType !== 'episode') {
      return null
    }

    return this.episodesService.findOne(download._id)
  }

  /**
   * Formats the download speed correctly
   *
   * @param {Download} download - The download to format it on
   */
  @ResolveField(type => String)
  public speed(@Parent() download): string {
    return formatBytes(download.speed, true)
  }

  /**
   * Formats the download time remaining correctly
   *
   * @param {Download} download - The download to format it on
   */
  @ResolveField(type => String)
  public timeRemaining(@Parent() download): string {
    return formatMsToRemaining(download.timeRemaining)
  }

}
