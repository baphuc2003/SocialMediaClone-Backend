import {
  Inject,
  Injectable,
  OnApplicationShutdown,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { ClientKafka, KafkaOptions, Transport } from "@nestjs/microservices";
import { Kafka, Producer, ProducerRecord } from "kafkajs";

@Injectable()
export class KafkaProducerService
  implements OnModuleInit, OnApplicationShutdown
{
  private readonly kafka = new Kafka({
    brokers: ["localhost:9092"],
  });

  private readonly producer: Producer = this.kafka.producer();

  async onModuleInit() {
    await this.producer.connect(); // Kết nối Kafka khi khởi tạo module
  }

  async onApplicationShutdown(signal?: string) {
    await this.producer.disconnect();
  }

  async produce(message: ProducerRecord) {
    this.producer.send(message);
  }
}
