export { Images } from './images.object-type'
export { imagesSchema } from './images.schema'

export { ImageSizes } from './image-sizes/image-sizes.object-type'
export { imageSizesSchema } from './image-sizes/image-sizes.schema'

export const IMAGE_HOLDER = null

export const IMAGE_DEFAULT = {
  full: IMAGE_HOLDER,
  high: IMAGE_HOLDER,
  medium: IMAGE_HOLDER,
  thumb: IMAGE_HOLDER
}

export const IMAGES_DEFAULT_FULL = {
  backdrop: IMAGE_DEFAULT,
  poster: IMAGE_DEFAULT,
  logo: IMAGE_DEFAULT,
  banner: IMAGE_DEFAULT,
}

export const IMAGES_DEFAULT = {
  backdrop: IMAGE_DEFAULT,
  poster: IMAGE_DEFAULT,
}
