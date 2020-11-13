import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ImagesSizes {

  @Field({ description: 'Original image', nullable: true })
  full?: string

  @Field({ description: 'High quality image', nullable: true })
  high?: string

  @Field({ description: 'Medium quality image', nullable: true })
  medium?: string

  @Field({ description: 'Thumb version of the image', nullable: true })
  thumb?: string

}
