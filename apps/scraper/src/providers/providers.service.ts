import { Inject, Injectable } from '@nestjs/common'
import { BaseProvider } from '@pct-org/scraper/base-provider'
import { YtsProviderService } from '@pct-org/scraper/yts-provider'
import { EztvProviderService } from '@pct-org/scraper/eztv-provider'

@Injectable()
export class ProvidersService {

  @Inject()
  private readonly ytsService: YtsProviderService

  @Inject()
  private readonly eztvService: EztvProviderService

  public getProviders(): BaseProvider[] {
    return [
      this.ytsService,
      this.eztvService
    ]
  }

}
