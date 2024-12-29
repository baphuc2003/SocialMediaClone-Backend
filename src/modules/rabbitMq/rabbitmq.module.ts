// src/rabbitmq.module.ts
import { Module, Global } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: "RABBITMQ_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: ["amqp://localhost:5672"], // Thay bằng URL RabbitMQ của bạn
          queue: "main_queue", // Đặt tên queue mà bạn muốn sử dụng
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class RabbitMQModule {}
