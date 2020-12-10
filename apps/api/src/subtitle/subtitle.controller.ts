import * as path from 'path'
import * as fs from 'fs'
import { Controller, Get, Res, Req, Param, Logger, Inject, Query } from '@nestjs/common'
import * as srtToVtt from 'srt-to-vtt'
import * as subsrt from 'subsrt'

import { ConfigService } from '../shared/config/config.service'

@Controller()
export class SubtitleController {

  private readonly logger = new Logger(SubtitleController.name)

  @Inject()
  private readonly configService: ConfigService

  @Get('subtitle/:_id/:code')
  public subtitle(
    @Param() params,
    @Res() res,
    @Req() req,
    @Query('output') output = 'vtt'
  ) {
    this.logger.debug(`[${params._id}]: Get subtitle with code "${params.code}"`)

    const subtitleFile = path.resolve(
      this.configService.get(ConfigService.DOWNLOAD_LOCATION),
      params._id,
      `${params.code}.srt`
    )

    if (!fs.existsSync(subtitleFile)) {
      res.status(404)

      return res.send('File not found!')
    }

    if (output === 'json') {
      res.status(200)
      res.headers({
        'access-control-allow-origin': '*',
        'Content-Type': 'application/json; charset=utf-8'
      })

      return res.send(
        subsrt.convert(
          fs.readFileSync(subtitleFile, 'utf8'),
          { format: 'json' }
        )
      )
    }

    const { size } = fs.statSync(subtitleFile)

    let streamOptions = null

    res.status(200)
    res.headers({
      'access-control-allow-origin': '*',
      'Content-Type': 'text/vtt; charset=utf-8'
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

    const readStream = fs.createReadStream(
      subtitleFile,
      streamOptions
    )

    if (output === 'vtt') {
      return res.send(
        readStream.pipe(srtToVtt())
      )
    }

    res.send(readStream)
  }

}
