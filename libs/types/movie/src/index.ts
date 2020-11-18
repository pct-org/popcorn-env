import { MongooseModule } from '@nestjs/mongoose'

export { MoviesService } from './movies.service'
export { Movie } from './movie.object-type'
export { MovieModel } from './movie.model'
export { MoviesArgs } from './dto/movies.args'
export { MovieArgs } from './dto/movie.args'

import { movieSchema } from './movie.schema'

export const MOVIES_MONGOOSE_FEATURE = MongooseModule.forFeature([{ name: 'Movies', schema: movieSchema }])

export const MOVIE_TYPE = 'movie'
export const MOVIES_TYPE = 'movies'
