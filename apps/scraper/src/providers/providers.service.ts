import { Inject, Injectable } from '@nestjs/common'
import { BaseProvider } from '@pct-org/scraper/providers/base'
import { YtsProviderService } from '@pct-org/scraper/providers/yts'
import { EztvProviderService } from '@pct-org/scraper/providers/eztv'

@Injectable()
export class ProvidersService {

  @Inject(YtsProviderService)
  private readonly ytsService: YtsProviderService

  @Inject(EztvProviderService)
  private readonly eztvService: EztvProviderService

  public getProviders(): BaseProvider[] {
    return [
      this.ytsService,
      this.eztvService
    ]
  }

}
