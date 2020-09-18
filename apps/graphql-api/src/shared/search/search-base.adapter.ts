import { HttpService } from '@nestjs/common'
import { Episode, Movie, Torrent } from '@pct-org/mongo-models'

/**
 * TODO:: Move almost all logic from this to a utils package as the scraper also
 * uses some of this logic and so the app can also use it
 */
export abstract class SearchAdapter {

  public static TORRENT_TYPE = 'searched'

  constructor(
    protected readonly httpService: HttpService
  ) {
  }

  searchEpisode: (episode: Episode) => Promise<any>

  searchMovie: (episode: Movie) => Promise<any>

  protected buildSeasonEpisodeString = (episode: Episode): string => {
    const seasonNr = `0${episode.season}`
    const episodeNr = `0${episode.number}`

    return `S${seasonNr.slice(-2)}E${episodeNr.slice(-2)}`
  }

  protected getEpisodeQuery = (episode: Episode): string => {
    const searchTitle = episode.show.title.toLowerCase()
      .replace(/\s/g, '.')

    return `${searchTitle}.${this.buildSeasonEpisodeString(episode)}`
  }

  /**
   * Determines the quality if the magnet
   *
   * @param title - Title of the torrent
   */
  protected determineQuality = (title): string => {
    const lowerCaseMetadata = title.toLowerCase()

    // Filter non-english languages
    if (this.hasNonEnglishLanguage(lowerCaseMetadata)) {
      return null
    }

    // Most accurate categorization
    if (lowerCaseMetadata.includes('2160')) return '2160p'
    if (lowerCaseMetadata.includes('4k')) return '2160p'
    if (lowerCaseMetadata.includes('1080')) return '1080p'
    if (lowerCaseMetadata.includes('720')) return '720p'
    if (lowerCaseMetadata.includes('480')) return '480p'

    // Guess the quality 1080p
    if (lowerCaseMetadata.includes('bluray')) return '1080p-bl'
    if (lowerCaseMetadata.includes('blu-ray')) return '1080p-bl'

    // Guess the quality 720p, prefer english
    if (lowerCaseMetadata.includes('dvd')) return '720p-ish'
    if (lowerCaseMetadata.includes('rip')) return '720p-ish'
    if (lowerCaseMetadata.includes('mp4')) return '720p-ish'
    if (lowerCaseMetadata.includes('web')) return '720p-ish'
    if (lowerCaseMetadata.includes('hdtv')) return '720p-ish'

    return null
  }

  protected getStringSize = (bytes: number): string => {
    if (!bytes || bytes === 0) {
      return '0 Byte'
    }

    const i = parseInt(
      `${Math.floor(
        Math.log(bytes) / Math.log(1024)
      )}`,
      10
    )

    return `${(bytes / (1024 ** i)).toFixed(2)} ${['Bytes', 'KB', 'MB', 'GB'][i]}`
  }

  /**
   * Checks if the given metadata contains a non english language
   *
   * @param metadata
   */
  private hasNonEnglishLanguage = (metadata: string): boolean => {
    if (metadata.includes('french')) return true
    if (metadata.includes('german')) return true
    if (metadata.includes('greek')) return true
    if (metadata.includes('dutch')) return true
    if (metadata.includes('hindi')) return true
    if (metadata.includes('português')) return true
    if (metadata.includes('portugues')) return true
    if (metadata.includes('spanish')) return true
    if (metadata.includes('español')) return true
    if (metadata.includes('espanol')) return true
    if (metadata.includes('latino')) return true
    if (metadata.includes('russian')) return true

    return metadata.includes('subtitulado')
  }

}
