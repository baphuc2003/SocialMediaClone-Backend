import { Module } from "@nestjs/common";
import { KafkaProducerService } from "./kafka.producer.service";
import { KafkaConsumerService } from "./kafka.consumer.service";
import { KafkaController } from "./kafka.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "KAFKA_SERVICE",
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ["localhost:9092"],
            clientId: "my-kafka-client",
          },
          consumer: {
            groupId: "kafka-consumer",
          },
        },
      },
    ]),
  ],
  providers: [KafkaProducerService, KafkaConsumerService],
  controllers: [KafkaController],
})
export class KafkaModule {}
