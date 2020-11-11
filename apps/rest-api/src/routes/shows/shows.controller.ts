import { Controller, Get } from '@nestjs/common'

@Controller('/shows')
export class ShowsController {

  @Get('')
  public watch() {
    return 'ok'
  }

}
