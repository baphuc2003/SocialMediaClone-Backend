// src/rabbitmq.module.ts
import { Module, Global, forwardRef } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { RabbitMQService } from "./rabbitmq.service";
import { RabbitMQController } from "./rabbitmq.controller";
import { RabbitMQConsumer } from "./rabbitmq.consumer";
import { ElasticsearchModule } from "../elasticsearch/elasticsearch.module";
import { rabbitmqProvider } from "./rabbitmq.provider";
import { ConfigModule } from "@nestjs/config";

@Global()
@Module({
  imports: [forwardRef(() => ElasticsearchModule), ConfigModule],
  controllers: [RabbitMQController, RabbitMQConsumer],
  providers: [RabbitMQService, RabbitMQConsumer, rabbitmqProvider],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}
