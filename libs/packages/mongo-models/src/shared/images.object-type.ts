import { Field, ObjectType } from '@nestjs/graphql'

import { ImagesSizes } from './images-sizes.object-type'

@ObjectType()
export class Images {

  @Field(type => ImagesSizes, { description: 'A backdrop image for the content.', nullable: true })
  backdrop?: ImagesSizes

  @Field(type => ImagesSizes, { description: 'A poster image for the content.', nullable: true })
  poster?: ImagesSizes

  @Field(type => ImagesSizes, { description: 'A hd clear logo image for the content.', nullable: true })
  logo?: ImagesSizes

  @Field(type => ImagesSizes, { description: 'A banner image for the content.', nullable: true })
  banner?: ImagesSizes

}
