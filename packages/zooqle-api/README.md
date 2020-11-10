# Overview

- [Installation](#installation)
- [Zooqle Search](#zooqle-search)
    - [Search By Query](#search-by-query)
    - [Search By IMDB Id](#search-by-imdb-id)
    - [Search By Magnet Hash](#search-by-magnet-hash)
    - [Search Parameters](#search-parameters)
    - [Search Returns](#search-returns)
- [Zooqle GetData](#zooqle-getdata)
- [Zooqle GetTorrentData](#zooqle-gettorrentdata)
- [Endpoint](#endpoint)

# made with ♥️ and typescript
There is complete type support for all api returns.
![](https://i.imgur.com/AwWFGum.png)

# Installation

1. install module.

        npm i zooqle

2. include it in your project.

    ```js
    // node way
    const { zooqle } = require('zooqle')

    // es6 way
    import { zooqle } from 'zooqle'
    ```

3. if you are using this package with typescript you should install the cheerio types.

        npm i @types/cheerio -D

# Zooqle Search

**Parameters:**
- query: **string**
- params _(optimal)_: **string array**

**return**: Promise<[returns](#returns)>

```js
// (query: string, params?: string[]): Promise
zooqle.search()
```

## Search by Query
Search zooqle for something....

You can use [search parameters](#search-parameters) to sort results

**return:** Promise<[search](#search)>

**example:**
```js
zooqle.search('silicon valley').then(response => {
  // code
})
```

## Search by IMDB Id

Search zooqle for a certain Movie or Show.
**return:** Promise<[show](#show) | [movie](#movie)>

**example:**
```js
zooqle.search('tt2575988').then(response => {
  // code
})
```

## Search by Magnet hash
Search zooqle for a certain Torrent.

**return:** Promise<[torrent](#torrent)>

**example:**
```js
zooqle.search('115E8B3596DE77BF6A463B2654697F47F4064DB6').then(response => {
  // code
})
```

## Search Parameters
By using search parameters you can apply zooqle link parameters to any search that you do.

**example:**
```js
// using enums
const linkParameters = [
    zooqle.enums.SORT.seeders, 
    zooqle.enums.SORT_TYPE.descending
]

zooqle.search('silicon valley', linkParameters).then(response => {
    // code
}

// passing strings
const linkParameters = [
    's=ns',
    'sd=d'
]

zooqle.search('silicon valley', linkParameters).then(response => {
    // code
}
```

**value map:**
```js
// SORT
seeders: 's=ns'
date: 's=dt'
size: 's=sz'

// SORT_TYPE
descending: 'sd=d'
ascending: 'sd=a'
```

## Search Returns

### search
**example return:**
```json
{
    "type": "search",
    "searchResponse": {
        "searchResults": [
            {
                "filetype": "show",
                "href": "/silicon-valley-s04e07-hdtv-x264-sva-rartv-w8suk.html",
                "title": "Silicon Valley S04E07 HDTV x264-SVA[rartv]",
                "size": "150 MB",
                "seeders": 570,
                "leechers": 17,
                "magnet": "magnet:?xt=urn:btih:115E8B3596DE77BF6A463B2654697F47F4064DB6&dn=%5Bzooqle.com%5D%20Silicon%20Valley%20S04E07%20HDTV%20x264-SVA%5Brartv%5D&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=http://explodie.org:6969/announce&tr=http://tracker.mg64.net:6881/announce&tr=http://mgtracker.org:2710/announce",
                "hash": "115E8B3596DE77BF6A463B2654697F47F4064DB6"
            },
            ...
        ],
        "search": "silicon valley",
        "pageSize": 30,
        "total": 931
    }
}
```

### show
**example return:**
```json
{
    "type": "show",
    "showResponse": {
        "title": "Silicon Valley",
        "from": "April 6, 2014",
        "to": "May 27, 2018",
        "summary": "Follows the struggle of Richard Hendricks, a silicon valley engineer trying to build his own company called Pied Piper",
        "seasons": [
            {
                "season": "Season 5",
                "date": "March 25, 2018",
                "episodes": [
                    {
                        "episodeNumber": "*",
                        "episodeTitle": "Compilations & Specials",
                        "dataHref": "/misc/tveps.php?show=60573&se=5&ep=-1"
                    },
                    {
                        "episodeNumber": "1",
                        "episodeTitle": "Grow Fast or Die Slow",
                        "dataHref": "/misc/tveps.php?show=60573&se=5&ep=1"
                    },
                    ...
                ]
            },
            ...
        ]
    }
}
```

### movie
**example return:**
```json
{
    "type": "movie",
    "movieResponse": {
        "title": "The Dark Knight (2008)",
        "summary": "When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham, the Dark Knight must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        "release": "July 16, 2008",
        "results": [
            {
                "title": "The Dark Knight 2008 IMAX BluRay 2160p x265 HDR DD 5 1[En Hi]-DT",
                "torrentHref": "/the-dark-knight-2008-imax-bluray-2160p-x265-hdr-dd-5-1-en-hi-dt-wyu0g.html",
                "sound": "5.1",
                "language": "en,hi",
                "quality": "2160p",
                "size": "22.9 GB",
                "seeders": 15,
                "leechers": 15
            },
            ...
        ]
    }
}
```

### torrent
**example return:**
```json
{
    "type": "torrent",
    "torrentResponse": {
        "filetype": "movie",
        "title": "Batman.-.The.Dark.Knight.2008.(2160p.x265.10bit.S90.Joy).torrent",
        "source": null,
        "sourceUrl": null,
        "magnet": "magnet:?xt=urn:btih:58CB561E616FA4FCCE3D5FE48AD4AB48101CDDCB&dn=%5Bzooqle.com%5D%20Batman%20-%20The%20Dark%20Knight%202008%20%282160p%20x265%2010bit%20S90%20Joy%29&tr=udp://tracker.leechers-paradise.org:6969&tr=http://explodie.org:6969/announce&tr=http://mgtracker.org:2710/announce&tr=http://tracker.mg64.net:6881/announce&tr=http://announce.xxx-tracker.com:2710/announce&xl=7262420065&tr=udp%3A%2F%2Fp4p.arenabg.com%3A1337&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Feddie4.nl%3A6969&tr=udp%3A%2F%2Fpublic.popcorn-tracker.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969",
        "hash": "58CB561E616FA4FCCE3D5FE48AD4AB48101CDDCB",
        "size": "6.8 GB",
        "date": "Mar 24, 2018"
    }
}
```

# Zooqle GetData

Sometimes the scrapper search result will return a property called "dataHref", which is more data about the current result hidden within another subpage of zooqle.

To get this data, you can simply pass the "dataHref" property to the getData function.

**Parameters:**
- query: **string**
- params _(optimal)_: **string array**

**return**: Promise<[data](#data-return)>

```js
// (dataHref: string): Promise
zooqle.getData()
```

**example:**

```js
zooqle.getData('/misc/tveps.php?show=60573&se=5&ep=1').then(response => {
    // code
})
```

## data return
**example return:**
```json
[
    {
        "title": "Silicon Valley S05E01 (1080p AMZN WEB-DL x265 HEVC 10bit AC3 5 1 Qman) [UTR]",
        "metaUrl": "/silicon-valley-s05e01-1080p-amzn-web-dl-x265-hevc-10bit-ac3-5-1-wqqje.html",
        "sound": "5.1",
        "language": "en",
        "quality": "1080p",
        "magnet": "magnet:?xt=urn:btih:FE07B9CD13412F8635616E59FCC5EF98ACD5339E&dn=%5Bzooqle.com%5D%20Silicon%20Valley%20S05E01%20%281080p%20AMZN%20WEB-DL%20x265%20HEVC%2010bit%20AC3%205%201%20Qman%29%20%5BUTR%5D&tr=udp://tracker.leechers-paradise.org:6969&tr=http://explodie.org:6969/announce&tr=http://mgtracker.org:2710/announce&tr=http://tracker.mg64.net:6881/announce&tr=http://announce.xxx-tracker.com:2710/announce",
        "hash": "FE07B9CD13412F8635616E59FCC5EF98ACD5339E",
        "size": "656 MB",
        "seeders": 17,
        "leechers": 5
    },
    {
        "title": "Silicon Valley (2014) - S05E01 (1080p AMZN WEB-DL x265 HEVC 10bit EAC3 6 0 RZeroX)",
        "metaUrl": "/silicon-valley-2014-s05e01-1080p-amzn-web-dl-x265-hevc-10bit-eac-wqpau.html",
        "sound": "5.1",
        "language": "en",
        "quality": "1080p",
        "magnet": "magnet:?xt=urn:btih:94C1F498C41DB7F8E35CF43FEAC616448E2E9E9D&dn=%5Bzooqle.com%5D%20Silicon%20Valley%20%282014%29%20-%20S05E01%20%281080p%20AMZN%20WEB-DL%20x265%20HEVC%2010bit%20EAC3%206%200%20RZeroX%29&tr=udp://tracker.leechers-paradise.org:6969&tr=http://explodie.org:6969/announce&tr=http://mgtracker.org:2710/announce&tr=http://tracker.mg64.net:6881/announce&tr=http://announce.xxx-tracker.com:2710/announce",
        "hash": "94C1F498C41DB7F8E35CF43FEAC616448E2E9E9D",
        "size": "660 MB",
        "seeders": 11,
        "leechers": 8
    },
    ...
]
```

# Zooqle GetTorrentData

If you have an url to a torrent subpage of Zooqle you can use getTorrentData to get meta info about the torrent.

Sometimes the scrapper will return a property called "torrentHref", which can be passed to this function.

**Parameters:**
- torrentHref: **string**

**return**: Promise<[torrentData](#torrentdata%20return)>

```js
// (dataHref: string): Promise
zooqle.getTorrentData()
```

**example:**
```js
zooqle.getTorrentData('/batman-the-dark-knight-2008-2160p-x265-10bit-s90-joy-wqipm.html').then(response => {
    // code
})
```

## torrentData return
**example return:**
```json
{
    "filetype": "movie",
    "title": "Batman.-.The.Dark.Knight.2008.(2160p.x265.10bit.S90.Joy).torrent",
    "source": null,
    "sourceUrl": null,
    "magnet": "magnet:?xt=urn:btih:58CB561E616FA4FCCE3D5FE48AD4AB48101CDDCB&dn=%5Bzooqle.com%5D%20Batman%20-%20The%20Dark%20Knight%202008%20%282160p%20x265%2010bit%20S90%20Joy%29&tr=udp://tracker.leechers-paradise.org:6969&tr=http://explodie.org:6969/announce&tr=http://mgtracker.org:2710/announce&tr=http://tracker.mg64.net:6881/announce&tr=http://announce.xxx-tracker.com:2710/announce&xl=7262420065&tr=udp%3A%2F%2Fp4p.arenabg.com%3A1337&tr=udp%3A%2F%2F9.rarbg.to%3A2710&tr=udp%3A%2F%2Feddie4.nl%3A6969&tr=udp%3A%2F%2Fpublic.popcorn-tracker.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969",
    "hash": "58CB561E616FA4FCCE3D5FE48AD4AB48101CDDCB",
    "size": "6.8 GB",
    "date": "Mar 24, 2018"
}
```

# Endpoint

you can change the zooqle endpoint by simply setting the "endpoint" propertie in the zooqle class object like so:

```js
zooqle.endpoint = 'https://zooqle.com'
```