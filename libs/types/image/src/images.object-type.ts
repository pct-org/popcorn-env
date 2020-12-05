import { Field, ObjectType } from '@nestjs/graphql'

import { ImageSizes } from './image-sizes/image-sizes.object-type'

@ObjectType()
export class Images {

  @Field(type => ImageSizes, { description: 'A backdrop image for the content.', nullable: true })
  backdrop?: ImageSizes

  @Field(type => ImageSizes, { description: 'A poster image for the content.', nullable: true })
  poster?: ImageSizes

  @Field(type => ImageSizes, { description: 'A hd clear logo image for the content.', nullable: true })
  logo?: ImageSizes

  @Field(type => ImageSizes, { description: 'A banner image for the content.', nullable: true })
  banner?: ImageSizes

}
