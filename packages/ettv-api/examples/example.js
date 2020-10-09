/* eslint-disable no-console */
/* eslint-disable max-len */
'use strict'

const EttvApi = require('..')

const ettvApi = new EttvApi()

// ettvApi.getDaily() // For the daily database dump.
// ettvApi.getFull()  // For the full database dump.

// Both methods return a promise with
ettvApi.getDaily(['Movies']).then(res => {
  const [torrent] = res
  // Or without array destructuring:
  // const torrent = res[0]

  console.log(res)
  // {
  //   hash: '97f6b9c0b27061fb76aa4963918668b13644be3a',
  //   title: 'NCIS.New.Orleans.S04E13.HDTV.x264-LOL[ettv]',
  //   category: 'TV',
  //   link: 'https://www.ettv.tv/torrent/ncis-new-orleans-s04e13-hdtv-x264-lol-ettv--69855',
  //   magnet: '$magnet:?xt=urn%3Abtih%3A97f6b9c0b27061fb76aa4963918668b13644be3a&dn=NCIS.New.Orleans.S04E13.HDTV.x264-LOL%5Bettv%5D&tr=udp%253A%252F%252Ftracker.coppersurfer.tk%3A6969%2Fannounce%26&tr=udp%253A%252F%252F9.rarbg.to%3A2710%2Fannounce%26&tr=udp%253A%252F%252F9.rarbg.me%3A2710%2Fannounce%26&tr=udp%253A%252F%252FIPv6.open-internet.nl%3A6969%2Fannounce%26&tr=udp%253A%252F%252Ftracker.internetwarriors.net%3A1337%2Fannounce%26&tr=udp%253A%252F%252Ftracker.opentrackr.org%3A1337%2Fannounce%26&tr=udp%253A%252F%252Fp4p.arenabg.com%3A1337%2Fannounce%26&tr=udp%253A%252F%252Feddie4.nl%3A6969%2Fannounce%26&tr=udp%253A%252F%252Fshadowshq.yi.org%3A6969%2Fannounce%26&tr=udp%253A%252F%252Ftracker.leechers-paradise.org%3A6969%2Fannounce%26&tr=udp%253A%252F%252Fexplodie.org%3A6969%2Fannounce%26&tr=udp%253A%252F%252Ftracker.tiny-vps.com%3A6969%2Fannounce%26&tr=udp%253A%252F%252Finferno.demonoid.pw%3A3391%2Fannounce%26&tr=udp%253A%252F%252Fipv4.tracker.harry.lu%3A80%2Fannounce%26&tr=udp%253A%252F%252Fpeerfect.org%3A6969%2Fannounce%26&tr=udp%253A%252F%252Ftracker.pirateparty.gr%3A6969%2Fannounce%26&tr=udp%253A%252F%252Ftracker.vanitycore.co%3A6969%2Fannounce%26&tr=udp%253A%252F%252Fopen.stealth.si%3A80%2Fannounce%26&tr=udp%253A%252F%252Ftracker.torrent.eu.org%3A451%26&tr=udp%253A%252F%252Ftracker.zer0day.to%3A1337%2Fannounce%26&tr=udp%253A%252F%252Ftracker.open-internet.nl%3A6969%2Fannounce'
  // }
}).catch(err => console.error(err))
