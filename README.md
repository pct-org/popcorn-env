<h1 align="center">
  <img height="200" width="200" src="https://github.com/pct-org/getting-started/blob/master/.github/logo.png" alt="logo" />
  <br />
  Popcorn env
</h1>

This repo holds everything you need (except the [app]) to run the PCT environment.

## In this repo

```
.
├── apps                        # All the main apps
│   ├── api                     # GraphQL API to run on your own server
│   ├── rest-api                # Rest API to be backwords compatible with official PCT clients
│   └── scraper                 # Scraper to collect and store all the data
├── packages                    # Packages that are published to NPM
│   ├── ettv-api                # 
│   ├── eztv-api                # 
│   ├── solidtorrents-api       # 
│   └── zooqle-api              # 
└── libs                        # Internal libs used by the packages/apps
    ├── scraper                 # Collection of libs related to the scraper
    │   ├── helpers             # Collection of helpers
    │   │   ├── base            # Base helper
    │   │   ├── episode         # Helper in formating and storing episodes
    │   │   ├── movie           # Helper in formating and storing movies
    │   │   ├── season          # Helper in formating and storing seasons
    │   │   └── show            # Helper in formating and storing shows
    │   └── providers           # Collection of providers
    │       ├── base            # Base provider for the scraper
    │       ├── eztv            # EZTV provider, scraping eztv
    │       └── yts             # YTS provider, scraping yts
    ├── services                # Collection services
    │   ├── fanart              # Service for helping to get/collect data from fanart
    │   ├── omdb                # Service for helping to get/collect data from omdb
    │   ├── tmdb                # Service for helping to get/collect data from tmdb
    │   ├── trakt               # Service for helping to get/collect data from trakt
    │   └── tvdb                # Service for helping to get/collect data from tvdb
    ├── torrent/utils           # Small utils related to torrents
    └── types                   # Collection of types, contains mongo schema / model / graphql object type
        ├── blacklist           #
        ├── download            #
        ├── episode             #
        ├── image               #
        ├── movie               #
        ├── season              #
        ├── shared              #
        └── show                #
```

## How to run this

See the [docs](#) for more information on how to run this project.

## Contributing:

Please see the [contributing guide].

## Issues

File a bug against [pct-org/getting-started prefixed with \[getting-started\]](https://github.com/pct-org/getting-started/issues/new?title=[getting-started]%20).

## [License](./LICENSE)

This project is [MIT licensed](./LICENSE).

[contributing guide]: ./CONTRIBUTING.md
[app]: https://github.com/pct-org/native-app

