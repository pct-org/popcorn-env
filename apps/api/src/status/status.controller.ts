import { Controller, Get } from '@nestjs/common'

@Controller()
export class StatusController {

  @Get('status')
  public watch() {
    return 'ok'
  }

}
