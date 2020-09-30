export const torrentSchema: object = {
  title: String,
  quality: String,
  type: {
    type: String,
    default: 'scraped'
  },
  provider: String,
  seeds: Number,
  peers: Number,
  url: String,
  language: String,
  size: Number,
  sizeString: String,
}
