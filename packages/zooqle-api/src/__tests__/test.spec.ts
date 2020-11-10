/* tslint:disable:no-unused-expression */
import { zooqle } from './main'

import * as chai from 'chai'
import { it } from 'mocha'

describe('zooqle scraper tests', function () {
  it('search', async function () {
    const result = await zooqle.search('silicon valley')
    chai.expect(result).to.exist
    chai.expect(result.showResponse).to.not.exist
    chai.expect(result.searchResponse).to.exist
    chai.expect(result.type).to.exist
    chai.expect(result.type).to.be.equal('search')
    chai.expect(result.searchResponse).to.have.all.keys('searchResults', 'search', 'pageSize', 'total')
    chai.expect(result.searchResponse.searchResults).to.exist
    chai.expect(result.searchResponse.searchResults).to.be.an('array')
    result.searchResponse.searchResults.forEach((r) => {
      chai.expect(r).to.exist
      chai.expect(r).to.have.all.keys('filetype', 'href', 'title', 'size', 'seeders', 'leechers', 'magnet', 'hash')
    })
  })

  it('get data', async function () {
    const result = await zooqle.getData('/misc/tveps.php?show=60573&se=5&ep=1')
    chai.expect(result).to.exist
    chai.expect(result[0]).to.exist
    chai.expect(result.length).to.exist
    chai.expect(result).to.be.an('array')
    result.forEach(r => {
      chai.expect(r).to.exist
      chai.expect(r).to.have.all.keys('title', 'metaUrl', 'sound', 'language', 'quality', 'magnet', 'hash', 'size', 'seeders', 'leechers')
    })
  })

  it('get torrent data', async function () {
    const result = await zooqle.getTorrentData('/batman-the-dark-knight-2008-2160p-x265-10bit-s90-joy-wqipm.html')
    chai.expect(result).to.exist
    chai.expect(result.filetype).to.be.equal('movie')
    chai.expect(result.hash).to.exist
    chai.expect(result.hash).not.to.be.equal(null)
    chai.expect(result).to.have.all.keys('filetype', 'title', 'imdb', 'imdbId', 'source', 'sourceUrl', 'magnet', 'hash', 'size', 'date')
  })

  describe('search', function () {
    it('imdb show', async function () {
      const result = await zooqle.search('tt2575988')
      chai.expect(result).to.exist
      chai.expect(result.showResponse).to.exist
      chai.expect(result.searchResponse).to.not.exist
      chai.expect(result.movieResponse).to.not.exist
      chai.expect(result.type).to.exist
      chai.expect(result.type).to.be.equal('show')
      chai.expect(result.showResponse).to.have.all.keys('title', 'from', 'to', 'summary', 'imdb', 'imdbId', 'seasons')
      chai.expect(result.showResponse.seasons).to.exist
      chai.expect(result.showResponse.seasons).to.be.an('array')
      result.showResponse.seasons.forEach(season => {
        chai.expect(season).to.exist
        chai.expect(season).to.have.all.keys('season', 'date', 'episodes')
        chai.expect(season.episodes).to.be.an('array')
        season.episodes.forEach(episode => {
          chai.expect(episode).to.exist
          chai.expect(episode).to.have.all.keys('episodeNumber', 'episodeTitle', 'dataHref')
        })
      })
    })
    it('imdb movie', async function () {
      const result = await zooqle.search('tt0468569')
      chai.expect(result).to.exist
      chai.expect(result.movieResponse).to.exist
      chai.expect(result.showResponse).to.not.exist
      chai.expect(result.searchResponse).to.not.exist
      chai.expect(result.type).to.exist
      chai.expect(result.type).to.be.equal('movie')
      chai.expect(result.movieResponse).to.have.all.keys('title', 'summary', 'imdb', 'imdbId', 'release', 'results')
      chai.expect(result.movieResponse.results).to.be.an('array')
      result.movieResponse.results.forEach(r => {
        chai.expect(r).to.exist
        chai.expect(r).to.have.all.keys('title', 'torrentHref', 'sound', 'language', 'quality', 'size', 'seeders', 'leechers')
      })
    })
    it('imdb movie2', async function () {
      const result = await zooqle.search('tt0076759')
      chai.expect(result).to.exist
      chai.expect(result.movieResponse).to.exist
      chai.expect(result.showResponse).to.not.exist
      chai.expect(result.searchResponse).to.not.exist
      chai.expect(result.type).to.exist
      chai.expect(result.type).to.be.equal('movie')
      chai.expect(result.movieResponse).to.have.all.keys('title', 'summary', 'imdb', 'imdbId', 'release', 'results')
      chai.expect(result.movieResponse.results).to.be.an('array')
      result.movieResponse.results.forEach(r => {
        chai.expect(r).to.exist
        chai.expect(r).to.have.all.keys('title', 'torrentHref', 'sound', 'language', 'quality', 'size', 'seeders', 'leechers')
      })
    })
    it('torrent hash', async function () {
      const result = await zooqle.search('115E8B3596DE77BF6A463B2654697F47F4064DB6')
      chai.expect(result).to.exist
      chai.expect(result.torrentResponse).to.exist
      chai.expect(result.movieResponse).to.not.exist
      chai.expect(result.searchResponse).to.not.exist
      chai.expect(result.showResponse).to.not.exist
      chai.expect(result.type).to.exist
      chai.expect(result.type).to.be.equal('torrent')
      chai.expect(result.torrentResponse).to.have.all.keys('title', 'imdb', 'imdbId', 'source', 'sourceUrl', 'magnet', 'hash', 'size', 'date')
    })
  })
})
