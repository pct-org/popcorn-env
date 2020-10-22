import { Inject, Injectable } from '@nestjs/common'
import { BaseProvider } from '@pct-org/scraper/providers/base'
import { YtsProviderService } from '@pct-org/scraper/providers/yts'
import { EztvProviderService } from '@pct-org/scraper/providers/eztv'

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
