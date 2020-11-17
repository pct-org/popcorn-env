import { HttpService, } from '@nestjs/common'
import { Movie } from '@pct-org/types/movie'
import { Episode } from '@pct-org/types/episode'
import { Torrent } from '@pct-org/types/shared'

export abstract class SearchAdapter {

  public static TORRENT_TYPE = 'searched'

  constructor(
    protected readonly httpService: HttpService
  ) {
  }

  public abstract searchEpisode(episode: Episode): Promise<Torrent[]>

  public abstract searchMovie(episode: Movie): Promise<Torrent[]>

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
