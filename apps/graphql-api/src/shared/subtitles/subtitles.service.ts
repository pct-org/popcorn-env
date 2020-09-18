import { HttpService, Injectable, Logger } from '@nestjs/common'
import { Model } from 'mongoose'
import { Download } from '@pct-org/mongo-models'
import { TorrentFile } from 'webtorrent'
import * as OpenSubtitles from 'opensubtitles-api'
import { createWriteStream } from 'fs'

import { ConfigService } from '../config/config.service'
import { SubtitleInterface } from './subtitle.interface'

@Injectable()
export class SubtitlesService {

  private readonly logger = new Logger(SubtitlesService.name)

  private readonly client: OpenSubtitles

  private readonly enabled: boolean = true

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    const username = this.configService.get(ConfigService.OPENSUBTITLES_USERNAME)
    const password = this.configService.get(ConfigService.OPENSUBTITLES_PASSWORD)

    if (username && password) {
      this.client = new OpenSubtitles({
        useragent: 'Popcorn Time',
        username,
        password
      })

    } else {
      this.enabled = false
    }
  }

  /**
   * Searches for subtitles then downloads them and adds it to the download
   *
   * @param {Download} download - The download to add the found subtitles to.
   * @param {TorrentFile} torrent - The torrent to search subtitles for.
   * @param {boolean} retry - Are we allowed to retry or not.
   */
  public async searchForSubtitles(download: Model<Download>, torrent: TorrentFile, retry = true) {
    // Only search for subtitles when it's enabled
    if (!this.enabled) {
      return
    }

    this.logger.log(`[${download._id}]: Search for subtitles`)

    const filename = torrent.name
    const location = `${this.configService.get(ConfigService.DOWNLOAD_LOCATION)}/${download._id}`

    let imdbid = download._id
    let season = null
    let episode = null

    if (download.itemType === 'episode') {
      const [imdb, seasonNr, episodeNr] = download._id.split('-')

      imdbid = imdb
      season = seasonNr
      episode = episodeNr
    }

    try {
      const subtitles = await this.client.search({
        sublanguageid: 'all',
        filesize: torrent.length,
        path: `${location}/${torrent.path}`,
        imdbid,
        filename,
        season,
        episode,

        extensions: ['srt'],
        limit: 'best'
      })

      const subtitleLanguages = Object.keys(subtitles)

      if (subtitleLanguages.length > 0) {
        const formattedSubs = []

        this.logger.log(`[${download._id}]: Found subs for ${subtitleLanguages.join(',')}`)

        await Promise.all(
          subtitleLanguages.map(async (language) => {
            try {
              const subtitle: SubtitleInterface = subtitles[language]

              const subLocation = await this.downloadSubtitle(download, subtitle, location)

              formattedSubs.push({
                location: subLocation,
                language: subtitle.lang,
                code: subtitle.langcode,
                score: subtitle.score
              })
            } catch (err) {
              this.logger.error(`[${download._id}]: Could not download subtitle "${language}"`, err)
            }
          })
        )

        // Add the subtitles to the download
        download.subtitles = formattedSubs

        // Update the download
        download.save()
      }
    } catch (e) {
      if (e.message.includes('no such file or directory') && retry) {
        this.searchForSubtitles(download, torrent, false)

      } else {
        this.logger.error(`[${download._id}]: Could not search for subtitles`, e)
      }
    }
  }

  /**
   * Downloads the subtitle and returns the location
   *
   * @param {Download} download - The download of the subtitle.
   * @param {SubtitleInterface} subtitle - The subtitle to download.
   * @param {string} downloadLocation - Base location where to download to
   */
  private async downloadSubtitle(download: Model<Download>, subtitle: SubtitleInterface, downloadLocation: string) {
    const subLocation = `${subtitle.langcode}.srt`
    const writer = createWriteStream(`${downloadLocation}/${subLocation}`)

    const response = await this.httpService.get(subtitle.url, {
      responseType: 'stream'
    }).toPromise()

    response.data.pipe(writer)

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        this.logger.debug(`[${download._id}]: Downloaded subtitle "${subtitle.langcode}" to "${subLocation}"`)

        resolve(subLocation)
      })

      writer.on('error', reject)
    })
  }

}
