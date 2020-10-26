import * as fs from 'fs'
import * as path from 'path'
import { Controller, Get, Res, Req, Param, Logger, Inject } from '@nestjs/common'

import { ConfigService } from '../shared/config/config.service'
import { TorrentService } from '../shared/torrent/torrent.service'

@Controller()
export class WatchController {

  private readonly logger = new Logger(WatchController.name)

  @Inject()
  private readonly configService: ConfigService

  @Inject()
  private readonly torrentService: TorrentService

  /**
   * Get's all the files from a directory
   * @param dir
   */
  private getFiles = (dir) => {
    const filesInDirectory = fs.readdirSync(dir, { withFileTypes: true })

    const files = filesInDirectory.map((file) => {
      const res = path.resolve(dir, file.name)

      return file.isDirectory()
        ? this.getFiles(res)
        : res
    })

    return Array.prototype.concat(...files)
  }

  @Get('watch/:_id')
  public watch(
    @Param() params,
    @Res() res,
    @Req() req
  ) {
    this.logger.debug(`[${params._id}]: Watch`)

    const folderLocation = path.resolve(
      this.configService.get(ConfigService.DOWNLOAD_LOCATION),
      params._id
    )

    // Get all the files for this item
    const files = this.getFiles(folderLocation)

    // There are no files
    if (files.length === 0) {
      res.status(404)
      return res.send()
    }

    // Get the correct media file
    const mediaFile = files.reduce((previous, current, index) => {
      const formatIsSupported = !!this.torrentService.supportedFormats.find(format => (
        current.includes(format) && !current.includes('transcoding')
      ))

      if (formatIsSupported) {
        if (!previous || current.length > previous.length) {
          return current
        }
      }

      return previous

    }, null)

    // Return 404 if we did not find a media file
    if (!mediaFile) {
      res.status(404)
      return res.send()
    }

    // Check if we have this item downloading atm
    const torrent = this.torrentService.getTorrentForDownload(params)

    const isChromeCast = req?.query?.device === 'chromecast' ?? false

    // Get the size of the media file
    let { size: mediaSize } = fs.statSync(mediaFile)

    // If it its Chromecast and we have a torrent then use the file size from that
    if (isChromeCast && torrent) {
      mediaSize = torrent.file.length
    }

    let streamOptions = null

    // If we have range then we need to start somewhere else
    if (req.headers.range) {
      const parts = req.headers.range
        .replace(/bytes=/, '')
        .split('-')

      const partialStart = parts[0]
      const partialEnd = parts[1]

      const start = parseInt(partialStart, 10)
      const end = partialEnd
        ? parseInt(partialEnd, 10)
        : mediaSize - 1

      const chunkSize = (end - start) + 1

      res.status(isChromeCast ? 200 : 206)
      res.headers({
        'Content-Range': 'bytes ' + start + '-' + end + '/' + chunkSize,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4'
      })

      streamOptions = {
        start,
        end
      }
    } else {
      // Return a stream from the media
      res.status(200)
      res.headers({
        // 'Content-Length': mediaSize,
        'Content-Type': 'video/mp4'
      })
    }

    if (torrent) {
      // Create readStream for torrent to make start end bytes priority
      torrent.file.createReadStream(streamOptions)
    }

    const readStream = fs.createReadStream(mediaFile, streamOptions)

    res.send(readStream)
  }

}
