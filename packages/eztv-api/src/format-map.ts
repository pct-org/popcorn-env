import { ShowWithEpisodes, Torrent } from './interfaces'

const addTorrentToShow = (show: ShowWithEpisodes, season: string, episode: string, torrent: Torrent) => {
  if (!show.torrents[season]) {
    show.torrents[season] = {}
  }

  if (!show.torrents[season][episode]) {
    show.torrents[season][episode] = []
  }

  show.torrents[season][episode].push(torrent)

  return show
}

export default {
  'what-if-2021': {
    id: 6179,
    slug: 'what-if',
    formatShow: (show: ShowWithEpisodes): ShowWithEpisodes => {
      const marvelsWhatIfShow = {
        ...show,
        id: 0,
        slug: 'what-if-2021',
        imdb: 'tt10168312',
        torrents: {}
      }

      Object.keys(show.torrents)
        .forEach((season) => {
          Object.keys(show.torrents[season])
            .forEach((episode) => {
              show.torrents[season][episode].forEach((torrent: Torrent) => {
                if (torrent.title.includes('What If')) {
                  addTorrentToShow(marvelsWhatIfShow, season, episode, torrent)
                }
              })
            })
        })

      return marvelsWhatIfShow
    }
  },

  'what-if': {
    additionalShow: {
      id: 0,
      slug: 'what-if-2021',
      title: 'What If...'
    }
  }
}
