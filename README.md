<h1 align="center">
  <img height="200" width="200" src="https://github.com/pct-org/getting-started/blob/master/.github/logo.png" alt="logo" />
  <br />
  Popcorn env
</h1>

<div align="center">
  <a target="_blank" href="https://gitter.im/pct-org/Lobby">
    <img src="https://badges.gitter.im/popcorn-time-desktop.svg" alt="Gitter" />
  </a>
</div>

---

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

## Installation

### Platforms

There is a installation scripts available to help install everything you need to run on a certain platform, scripts that are available:
- [raspberry-pi](./docs/run-on.raspberry-pi.md)

Click on the links to ge more info on how to run on those platforms.

### Manual installation

> TODO

Last step is to copy the `ecosystem.config.example.js` to `ecosystem.config.js` file and fill it in.

## Starting the project (PM2)

```shell script
# To start the APIs (Scraper will immediately start scraping)
$ yarn start:prod

# To stop the APIs
$ yarn stop:prod

# To delete the PM2 apps
$ yarn delete:prod
```

## Contributing:

Please see the [contributing guide].

## Issues

File a bug against [pct-org/getting-started prefixed with \[getting-started\]](https://github.com/pct-org/getting-started/issues/new?title=[getting-started]%20).

## [License](./LICENSE)

This project is [MIT licensed](./LICENSE).

[contributing guide]: ./CONTRIBUTING.md
[app]: https://github.com/pct-org/native-app

