// rabbitmq.service.ts
import { Inject, Injectable } from "@nestjs/common";
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from "@nestjs/microservices";
import { RABBITMQ_CLIENT } from "./rabbitmq.provider";

@Injectable()
export class RabbitMQService {
  private clients: Map<string, ClientProxy> = new Map();

  constructor(
    @Inject(RABBITMQ_CLIENT)
    private readonly client: ClientProxy
  ) {}

  getClient(queue: string): ClientProxy {
    if (this.clients.has(queue)) {
      return this.clients.get(queue);
    }

    const client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL],
        queue,
        queueOptions: {
          durable: true,
        },
      },
    });

    this.clients.set(queue, client);
    return client;
  }

  async sendMessage(queue: string, pattern: string, data: any) {
    // const client = this.getClient(queue);
    // console.log("Client 1: ", client);

    try {
      return this.client.emit(pattern, data);
    } catch (error) {
      console.error("❌ Error in connect():", error?.message, error?.stack);
      return { error: "Failed to connect", detail: error?.message || error };
    }
  }
}
