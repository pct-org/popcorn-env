import { MongooseModule } from '@nestjs/mongoose'

export { MoviesService } from './movies.service'
export { MoviesArgs } from './dto/movies.args'
export { MovieArgs } from './dto/movie.args'

import { movieSchema } from './movie.schema'

export const MOVIES_MONGOOSE_FEATURE = MongooseModule.forFeature([{ name: 'Movies', schema: movieSchema }])
