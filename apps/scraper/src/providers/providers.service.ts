import { Injectable } from '@nestjs/common'
import { BaseProvider } from '@pct-org/scraper/base-provider'
import { YtsProviderService } from '@pct-org/scraper/yts-provider'

@Injectable()
export class ProvidersService {

  constructor(
    private readonly ytsService: YtsProviderService
  ) {
  }

  public getProviders(): BaseProvider[] {
    return [
      this.ytsService
    ]
  }

}
