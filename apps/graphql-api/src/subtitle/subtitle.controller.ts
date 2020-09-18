import * as path from 'path'
import * as fs from 'fs'
import { Controller, Get, Res, Req, Param, Logger } from '@nestjs/common'
import * as srtToVtt from 'srt-to-vtt'

import { ConfigService } from '../shared/config/config.service'

@Controller()
export class SubtitleController {

  private readonly logger = new Logger(SubtitleController.name)

  constructor(
    private readonly configService: ConfigService
  ) {}

  @Get('subtitle/:_id/:code')
  subtitle(
    @Param() params,
    @Res() res,
    @Req() req
  ) {
    this.logger.debug(`[${params._id}]: Get subtitle with code "${params.code}"`)

    const subtitleFile = path.resolve(
      this.configService.get(ConfigService.DOWNLOAD_LOCATION),
      params._id,
      `${params.code}.srt`
    )

    const { size } = fs.statSync(subtitleFile)

    let streamOptions = null

    res.status(200)
    res.headers({
      'access-control-allow-origin': '*',
      'Content-Type': 'text/vtt; charset=utf-8',
    })

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
        : size - 1

      const chunkSize = (end - start) + 1

      res.status(200)
      res.headers({
        'Content-Range': 'bytes ' + start + '-' + end + '/' + chunkSize,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize
      })

      streamOptions = {
        start,
        end
      }
    }

    res.send(
      fs.createReadStream(
        subtitleFile,
        streamOptions
      ).pipe(srtToVtt())
    )

    // res.send(
    //   createReadStream(
    //     path.resolve(
    //       this.configService.get(ConfigService.DOWNLOAD_LOCATION),
    //       params._id,
    //       `${params.code}.vtt`
    //     )
    //   )
    // )
  }

}
