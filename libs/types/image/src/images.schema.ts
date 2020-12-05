import { imageSizesSchema } from './image-sizes/image-sizes.schema'

export const imagesSchema = {
  type: {
    backdrop: imageSizesSchema,
    poster: imageSizesSchema,
    logo: imageSizesSchema,
    banner: imageSizesSchema
  }
}
