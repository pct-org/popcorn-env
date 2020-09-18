import { imagesSchema } from './images.schema'

export const contentSchema: object = {
  _id: {
    type: String,
    required: true
  },
  imdbId: String,
  tmdbId: Number,
  title: String,
  released: Number,
  certification: String,
  slug: String,
  synopsis: String,
  createdAt: Number,
  updatedAt: Number,
  runtime: {
    full: {
      type: String
    },
    short: {
      type: String
    },
    hours: {
      type: Number
    },
    minutes: {
      type: Number
    }
  },
  rating: {
    percentage: {
      type: Number
    },
    watching: {
      type: Number
    },
    votes: {
      type: Number
    },
    stars: {
      type: Number
    }
  },
  bookmarked: {
    type: Boolean,
    default: false
  },
  bookmarkedOn: Number,
  images: imagesSchema,
  genres: [String],
  type: String,
  trailer: {
    type: String,
    default: null
  },
  trailerId: {
    type: String,
    default: null
  }
}
