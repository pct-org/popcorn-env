import { ArgsType, Field } from '@nestjs/graphql'

@ArgsType()
export class DownloadArgs {

  @Field({ defaultValue: 'Id of the download.' })
  _id: string

}
