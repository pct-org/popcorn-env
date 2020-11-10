// Import the necessary modules.
/* eslint-disable no-console */
const SolidTorrentsApi = require('..')

// Create an instance of the API wrapper.
const solid = new SolidTorrentsApi()

// Simple search
solid.search('disenchantment')
  .then(res => console.log(res))
  .catch(err => console.error(err))
