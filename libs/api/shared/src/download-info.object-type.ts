import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DownloadInfo {

  @Field({ description: 'Is this episode downloaded', defaultValue: false, nullable: true })
  downloadComplete: boolean

  @Field( { description: 'Status of the download', defaultValue: null, nullable: true })
  downloadStatus: string

  @Field({ description: 'Is this episode currently being downloaded', defaultValue: false, nullable: true })
  downloading: boolean

  @Field({ description: 'The time this episode is downloaded', defaultValue: null, nullable: true })
  downloadedOn: number

  @Field({ description: 'The quality of the download', defaultValue: null, nullable: true })
  downloadQuality: string

}
