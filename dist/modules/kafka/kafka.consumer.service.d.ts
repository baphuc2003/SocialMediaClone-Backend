import { OnApplicationShutdown } from "@nestjs/common";
import { ConsumerRunConfig, ConsumerSubscribeTopics } from "kafkajs";
export declare class KafkaConsumerService implements OnApplicationShutdown {
    private readonly kafka;
    private readonly consumers;
    consume(topics: ConsumerSubscribeTopics, configs: ConsumerRunConfig): Promise<void>;
    onApplicationShutdown(): Promise<void>;
    handleEvent(message: any): Promise<void>;
}
