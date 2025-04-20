import {
  ClientProxyFactory,
  Transport,
  ClientsModuleOptionsFactory,
  ClientProxy,
} from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import type { RmqOptions, MicroserviceOptions } from "@nestjs/microservices";

export const RABBITMQ_CLIENT = "RABBITMQ_CLIENT";

export const rabbitmqProvider = {
  provide: RABBITMQ_CLIENT,
  useFactory: (configService: ConfigService): ClientProxy => {
    const rmqOptions: RmqOptions = {
      transport: Transport.RMQ,
      options: {
        urls: [configService.get<string>("RABBITMQ_URL")],
        queue: "sync_user_queue",
        queueOptions: { durable: true },
      },
    };

    return ClientProxyFactory.create(rmqOptions);
  },
  inject: [ConfigService],
};
