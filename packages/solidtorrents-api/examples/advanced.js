// Import the necessary modules.
/* eslint-disable no-console */
const SolidTorrentsApi = require('..')

// Create an instance of the API wrapper.
const solid = new SolidTorrentsApi()

// Advanced search
solid.search({
  page: 1,
  verified: 1,
  category: 'video',
  query: 'disenchantment'
}).then(res => console.log(res))
  .catch(err => console.error(err))
