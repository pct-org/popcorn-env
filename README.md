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

This repo holds everything you need (except the app) to run the Popcorn ENV.

## Projects

Popcorn env consists of two projects:

| Project                      | Description |
| ---------------------------- | -------------------------------------------------------- |
| [`@pct-org/popcorn-env`]     | Monorepo holding the backend, packages, scripts etc      |
| [`@pct-org/native-app`]      | React Native App                                         |

## In this repo

| Project                      | Description |
| ---------------------------- | -------------------------------------------------------- |
| [`api`]                      | GraphQL API the app communicates with                    |
| [`scraper`]                  | |

| Libs                         | Description |
| ---------------------------- | -------------------------------------------------------- |
| [`mongo-modals`]             | Models used for MongoDB and GraphQL object types         |

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
[`@pct-org/native-app`]: https://github.com/pct-org/native-app

