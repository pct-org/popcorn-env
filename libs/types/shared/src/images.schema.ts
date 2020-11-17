import { imagesSizesSchema } from './images-sizes.schema'

export const imagesSchema = {
  type: {
    backdrop: imagesSizesSchema,
    poster: imagesSizesSchema,
    logo: imagesSizesSchema,
    banner: imagesSizesSchema
  }
}
