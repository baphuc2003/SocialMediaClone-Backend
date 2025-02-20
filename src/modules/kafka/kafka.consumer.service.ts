import { Injectable, OnApplicationShutdown } from "@nestjs/common";
import {
  ClientKafka,
  EventPattern,
  KafkaOptions,
  Transport,
} from "@nestjs/microservices";
import {
  Consumer,
  ConsumerConfig,
  ConsumerRunConfig,
  ConsumerSubscribeTopics,
  Kafka,
} from "kafkajs";

@Injectable()
export class KafkaConsumerService implements OnApplicationShutdown {
  private readonly kafka = new Kafka({
    brokers: ["localhost:9092"],
  });

  private readonly consumers: Consumer[] = [];

  async consume(topics: ConsumerSubscribeTopics, configs: ConsumerRunConfig) {
    const consumer = this.kafka.consumer({ groupId: "nestjs-kafka" });

    await consumer.connect();

    await consumer.subscribe(topics);

    await consumer.run(configs);

    this.consumers.push(consumer);
  }

  async onApplicationShutdown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }
  @EventPattern("topic-name")
  async handleEvent(message: any) {
    console.log("check 21 ", message);
  }
}
