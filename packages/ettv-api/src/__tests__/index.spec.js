'use strict'

const { expect } = require('chai')
const { URL } = require('url')

const EttvApi = require('..')

/** @test {EttvApi} */
describe('EttvApi', () => {
  /**
   * The instance of the module to test.
   * @type {EttvApi}
   */
  let ettvApi

  /**
   * Hook for setting up the EttvApi tests.
   * @type {Function}
   */
  before(() => {
    ettvApi = new EttvApi()
  })

  /** @test {EttvApi#constructor} */
  it('should create an instance of EttvApi with parameters', () => {
    const ettvApi = new EttvApi({
      baseUrl: 'https://mybaseurl.com/',
      trackers: ''
    })

    expect(ettvApi).to.be.an.instanceOf(EttvApi)
    expect(ettvApi._baseUrl).to.be.a('string')
    expect(ettvApi._baseUrl).to.equal('https://mybaseurl.com/')
    expect(ettvApi._trackers).to.be.a('string')
    expect(ettvApi._trackers).to.equal('')
    expect(ettvApi._debug).to.be.a('function')
  })

  /** @test EttvApi#_get} */
  it('should throw an error when getting an incorrect endpoint', done => {
    const { href } = new URL('faulty', ettvApi._baseUrl)
    ettvApi._get(href)
      .then(done)
      .catch(err => {
        expect(err).to.be.an('Error')
        done()
      })
  })

  /**
   * Helper function to test the properties of a torrent object.
   * @param {!Torrent} torrent - The torrent object to test.
   * @returns {undefined}
   */
  function testTorrent(torrent) {
    expect(torrent).to.be.an('object')
    expect(torrent.hash).to.be.a('string')
    expect(torrent.magnet).to.be.a('string')
    expect(torrent.title).to.be.a('string')
    expect(torrent.category).to.be.a('string')
    expect(torrent.link).to.be.a('string')
  }

  /**
   * Helper function to test the properties of an api call.
   * @param {!Array<Torrent>} res - The response of the api call.
   * @returns {undefined}
   */
  function testResponse(res) {
    expect(res).to.be.an('array')
    expect(res.length).to.be.at.least(1)

    const random = Math.floor(Math.random() * res.length)
    const toTest = res[random]
    testTorrent(toTest)
  }

  /** @test {EttvApi#getDaily} */
  it('should get the daily database dump', done => {
    ettvApi.getDaily().then(res => {
      testResponse(res)
      done()
    }).catch(done)
  })

  /** @test {EttvApi#getFull} */
  it('should get the full database dump', done => {
    ettvApi.getFull().then(res => {
      testResponse(res)
      done()
    }).catch(done)
  })
})
