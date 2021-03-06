import { Injectable } from '@nestjs/common'
import { Client, StompHeaders, StompSubscription } from '@stomp/stompjs'
import { StompExplorer } from './stomp.explorer'

@Injectable()
export class StompService {
  constructor (private readonly explorerService: StompExplorer) {
  }

  /**
   * Main stomp client
   */
  public get client (): Client {
    return this.explorerService.client
  }

  /**
   * Subscribe to an subscription
   * @param queue
   * @param handler
   * @param headers
   */
  public subscribe (
    queue: string,
    handler,
    headers?: StompHeaders,
  ): StompSubscription {
    headers = headers || {}
    headers.ack = 'client'

    return this.client.subscribe(
      queue,
      async message => {
        await handler(message)
        message.ack()
      },
      headers,
    )
  }

  /**
   * Unsubscribe to an subscription
   */
  public unsubscribe (
    stompSubscription: StompSubscription,
    headers: StompHeaders,
  ) {
    stompSubscription.unsubscribe(headers)
  }

  /**
   * Publish raw message
   * @param queue
   * @param payload
   * @param headers
   * @param skipContentLengthHeader
   */
  public publishRaw (queue: string, payload: { body?: string, binaryBody?: Uint8Array }, headers?: StompHeaders, skipContentLengthHeader?: boolean) {
    this.client.publish({
      destination: queue,
      skipContentLengthHeader,
      body: payload.body,
      binaryBody: payload.binaryBody,
      headers
    })
  }

  /**
   * Publish JSON message.
   * It auto stringifies the message
   * @param queue
   * @param payload
   * @param headers
   * @param skipContentLengthHeader
   */
  public publishJson (queue: string, payload: { [key: string]: any }, headers?: StompHeaders, skipContentLengthHeader?: boolean) {
    this.client.publish({
      destination: queue,
      skipContentLengthHeader,
      headers,
      body: JSON.stringify(payload)
    })
  }

  /**
   * Publish message as string
   * @param queue
   * @param payload
   * @param headers
   * @param skipContentLengthHeader
   */
  public publishString (queue: string, payload: string, headers?: StompHeaders, skipContentLengthHeader?: boolean) {
    this.client.publish({
      destination: queue,
      skipContentLengthHeader,
      headers,
      body: JSON.stringify(payload)
    })
  }
}
