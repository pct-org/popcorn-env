import { imagesSizesSchema } from './images-sizes.schema'

export const imagesSchema: object = {
  type: {
    backdrop: imagesSizesSchema,
    poster: imagesSizesSchema,
    logo: imagesSizesSchema,
    banner: imagesSizesSchema
  }
}
