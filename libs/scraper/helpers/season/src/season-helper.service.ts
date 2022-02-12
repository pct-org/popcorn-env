import { Inject, Injectable, Logger } from '@nestjs/common'
import { ScrapedShowTorrents } from '@pct-org/scraper/providers/base'
import { InjectModel } from '@nestjs/mongoose'
import { Show } from '@pct-org/types/show'
import { Season, SEASON_TYPE, SeasonDocument } from '@pct-org/types/season'
import { Episode } from '@pct-org/types/episode'
import { EpisodeHelperService } from '@pct-org/scraper/helpers/episode'
import { IMAGES_DEFAULT } from '@pct-org/types/image'
import { TmdbService } from '@pct-org/services/tmdb'
import pMap from 'p-map'

import type { Model } from 'mongoose'

@Injectable()
export class SeasonHelperService {

  @InjectModel('Seasons')
  private readonly seasonModel: Model<SeasonDocument>

  @Inject()
  private readonly episodeHelperService: EpisodeHelperService

  @Inject()
  private readonly tmdbService: TmdbService

  protected readonly logger = new Logger('SeasonHelper')

  public formatTraktSeasons(show: Show, torrents: ScrapedShowTorrents): Season[] {
    const formattedSeasons: Season[] = []
    let traktSeasons = show._traktSeasons
    let seasonNumbers: any[] = Object.keys(torrents)

    // If we don't have any episodes for specials then also remove it from trakt
    if (!seasonNumbers.includes('0') && !seasonNumbers.includes(0)) {
      traktSeasons = traktSeasons.filter((traktSeason) => traktSeason.number !== 0)
    }

    traktSeasons.forEach((traktSeason) => {
      const formattedEpisodes = traktSeason?.episodes?.map((traktEpisode) => (
        this.episodeHelperService.formatTraktEpisode(
          show,
          traktEpisode,
          torrents?.[traktEpisode.season]?.[traktEpisode.number] ?? []
        )
      )) ?? []

      // Remove it from the episodes seasons
      seasonNumbers = seasonNumbers.filter((season) => parseInt(season, 10) !== traktSeason.number)

      let seasonFirstAired = Number(new Date(traktSeason?.first_aired)) ?? 0

      // If it's null then use the one from the first episode
      if (seasonFirstAired === 0 && formattedEpisodes.length > 0) {
        const firstEpisode = formattedEpisodes[0]

        seasonFirstAired = firstEpisode.firstAired
      }

      formattedSeasons.push({
        _id: `${show._id}-${traktSeason.number}`,
        tmdbId: traktSeason.ids.tmdb,
        showImdbId: show._id,

        firstAired: seasonFirstAired,
        number: traktSeason.number,
        synopsis: null,
        title: traktSeason.title,
        type: SEASON_TYPE,
        images: IMAGES_DEFAULT,
        createdAt: Number(new Date()),
        updatedAt: Number(new Date()),

        episodes: this.sortItems(formattedEpisodes) as Episode[],

        _traktSeason: true
      })
    })

    // If we still have some seasons left add them with what we can
    if (seasonNumbers.length > 0) {
      // TODO:: Maybe check the titles and check if they match the
      // name of the show then _traktSeason can be true
      // Also rename trakt season then to a better name
      seasonNumbers.forEach((seasonNr) => {
        const formattedEpisodes: Episode[] = []

        Object.keys(torrents[seasonNr]).map((episodeNr) => {
          formattedEpisodes.push(this.episodeHelperService.formatUnknownEpisode(
            show,
            parseInt(seasonNr, 10),
            parseInt(episodeNr, 10),
            torrents[seasonNr][episodeNr]
          ))
        })

        formattedSeasons.push({
          _id: `${show._id}-${seasonNr}`,
          tmdbId: null,
          showImdbId: show._id,

          firstAired: Number(new Date()),
          number: parseInt(seasonNr, 10),
          synopsis: null,
          title: `Season ${seasonNr}`,
          type: SEASON_TYPE,
          images: IMAGES_DEFAULT,
          createdAt: Number(new Date()),
          updatedAt: Number(new Date()),

          episodes: this.sortItems(formattedEpisodes) as Episode[],

          _traktSeason: false
        })
      })
    }

    return this.sortItems(formattedSeasons) as Season[]
  }

  public async enhanceSeasons(show: Show, seasons: Season[]): Promise<Season[]> {
    const enhancedSeasons: (boolean | Season)[] = await pMap(
      seasons,
      (season) => {
        return this.enhanceSeason(show, season)
      },
      {
        concurrency: 1
      }
    )

    // Remove all the falsy seasons
    return enhancedSeasons.filter(Boolean) as Season[]
  }

  public async addSeasonsToDatabase(seasons: Season[]): Promise<void> {
    await Promise.all(seasons.map((season) => this.addSeasonToDatabase(season)))
  }

  public async updateSeasonsInDatabase(seasons: Season[]): Promise<void> {
    await Promise.all(seasons.map(async (season) => {
      const existingSeason = await this.seasonModel.findById(season._id)

      if (existingSeason) {
        await this.updateSeasonInDatabase(season, existingSeason)

      } else {
        await this.addSeasonToDatabase(season)
      }
    }))
  }

  private async addSeasonToDatabase(season: Season): Promise<void> {
    const episodes = season.episodes
    delete season.episodes

    await this.seasonModel.create(season)
    await this.episodeHelperService.addEpisodesToDatabase(episodes)
  }

  private async updateSeasonInDatabase(season: Season, existingSeason: Season): Promise<void> {
    const episodes = season.episodes
    delete season.episodes

    season.updatedAt = Number(new Date())
    season.createdAt = existingSeason.createdAt

    await this.seasonModel.findByIdAndUpdate(season._id, season)
    await this.episodeHelperService.updateEpisodesInDatabase(episodes)
  }

  private async enhanceSeason(show: Show, season: Season): Promise<Season | boolean> {
    try {
      const tmdbSeason = await this.tmdbService.getSeasonInfo(show, season)

      // Also enhance all the episodes
      season.episodes = season.episodes.map((episode) => {
        const tmdbEpisode = tmdbSeason.episodes.find((tmdbEpisode) => (
          tmdbEpisode.episodeNumber === episode.number
        ))

        // If we have a matching episode then enhance it
        if (tmdbEpisode) {
          return {
            ...episode,

            title: episode.title !== `Episode ${episode.number}`
              ? episode.title
              : tmdbEpisode.name,
            synopsis: episode.synopsis || tmdbEpisode.overview,
            firstAired: tmdbEpisode.airDate && episode.firstAired === 0
              ? new Date(tmdbEpisode.airDate).getTime()
              : episode.firstAired,
            images: {
              ...episode.images,

              poster: this.tmdbService.formatImage(tmdbEpisode.stillPath)
            }
          }
        }

        return episode
      })

      return {
        ...season,

        title: season.title !== `Season ${season.number}`
          ? season.title
          : tmdbSeason.name,
        synopsis: season.synopsis || tmdbSeason.overview,
        firstAired: tmdbSeason.airDate && season.firstAired === 0
          ? new Date(tmdbSeason.airDate).getTime()
          : season.firstAired,
        images: {
          ...season.images,

          poster: this.tmdbService.formatImage(tmdbSeason.posterPath)
        }
      }
    } catch (err) {
      // If it was not a trakt season don't return it at all
      if (!season._traktSeason) {
        return false
      }
    }

    // We ware not able to enhance it, return trakt season
    return season
  }

  private sortItems(items: Episode[] | Season[]): Episode[] | Season[] {
    return items.sort((a, b) => a.number - b.number)
  }

}
