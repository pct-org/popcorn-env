import { PubSub } from 'graphql-subscriptions'

export class PubSubService {

  private pubSub: PubSub

  constructor() {
    this.pubSub = new PubSub()
  }

  public publish(triggerName, data) {
    return this.pubSub.publish(triggerName, data)
  }

  public asyncIterator(triggerName) {
    return this.pubSub.asyncIterator(triggerName)
  }

}
