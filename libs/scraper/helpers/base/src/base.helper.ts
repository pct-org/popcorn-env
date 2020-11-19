import { Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Runtime } from '@pct-org/types/shared'
import { Movie } from '@pct-org/types/movie'
import { Show } from '@pct-org/types/show'
import { IMAGE_HOLDER } from '@pct-org/types/image'
import { BlacklistModel } from '@pct-org/types/blacklist'
import { ScrapedItem, ScrapedTorrent, ScrapedShowTorrents } from '@pct-org/scraper/providers/base'

/**
 * Base class for scraping content from various sources.
 */
export abstract class BaseHelper {

  @InjectModel('Blacklist')
  private readonly blackListModel: typeof BlacklistModel

  protected abstract readonly logger: Logger

  public abstract getItem(imdb?: string, slug?: string): Promise<Movie | Show | undefined>

  public abstract shouldUpdateExistingItem(item: Movie | Show): boolean

  public abstract updateTraktInfo(item: Movie | Show): Promise<Movie | Show>

  public abstract addTraktInfo(item: ScrapedItem): Promise<Movie | Show | undefined>

  public abstract addImages(item: Movie | Show): Promise<Movie | Show>

  public abstract addTorrents(item: Movie | Show, torrents: ScrapedTorrent[] | ScrapedShowTorrents): Promise<Movie | Show>

  public abstract addItemToDatabase(item: Movie | Show): Promise<void>

  public abstract updateItemInDatabase(item: Movie | Show, hadMetadataUpdate?: boolean): Promise<void>

  /**
   * Formats runtime from minutes to, minutes, hours, short and full format
   */
  protected formatRuntime(runtimeInMinutes: number): Runtime {
    const hours = runtimeInMinutes >= 60 ? Math.round(runtimeInMinutes / 60) : 0
    const minutes = runtimeInMinutes % 60

    return {
      full: hours > 0
        ? `${hours} ${hours > 1 ? 'hours' : 'hour'}${minutes > 0
          ? ` ${minutes} minutes`
          : ''}`
        : `${minutes} minutes`,

      short: hours > 0
        ? `${hours} ${hours > 1 ? 'hrs' : 'hr'}${minutes > 0
          ? ` ${minutes} min`
          : ''}`
        : `${minutes} min`,

      hours,
      minutes
    }
  }

  /**
   * Generates a random date between two dates
   */
  protected generateRandomDateBetween(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  }

  /**
   * Adds a item to the blacklist
   */
  public async addToBlacklist(content: Pick<ScrapedItem, 'slug' | 'title'>, type: string, reason: string, weeks = null, until = null): Promise<void> {
    let expires = 0

    if (until) {
      this.logger.debug(`Adding "${content.title}" with identifier "${content.slug}" to the blacklist until '${until}' because of reason '${reason}'`)
      expires = Number(until)

    } else if (weeks) {
      this.logger.debug(`Adding "${content.title}" with identifier "${content.slug}" to the blacklist for ${weeks} weeks because of reason '${reason}'`)
      expires = Number(new Date(Date.now() + (6.04e+8 * weeks)))
    }

    await this.blackListModel.create({
      _id: content.slug,
      title: content.title,
      type,
      reason,
      expires,
      createdAt: Number(new Date()),
      updatedAt: Number(new Date())
    })
  }

  /**
   * Method to check the given images against the default ones.
   */
  protected checkImages(item: Show | Movie): Promise<Show | Movie> {
    for (const i in item.images.backdrop) {
      if (item.images.backdrop[i] === IMAGE_HOLDER) {
        return Promise.reject(item)
      }
    }

    for (const i in item.images.poster) {
      if (item.images.poster[i] === IMAGE_HOLDER) {
        return Promise.reject(item)
      }
    }

    return Promise.resolve(item)
  }

}
