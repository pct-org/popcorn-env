// Import the necessary modules.
/* eslint-disable no-console */
const KatApi = require('..')

// Create an instance of the API wrapper.
const kat = new KatApi()

// Advanced search
kat.search({
  page: 1,
  language: 'en',
  verified: 1,
  category: 'movies',
  subcate: 'hd',
}).then(res => console.log(res.results.length))
  .catch(err => console.error(err))
