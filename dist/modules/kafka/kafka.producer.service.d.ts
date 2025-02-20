import { OnApplicationShutdown, OnModuleInit } from "@nestjs/common";
import { ProducerRecord } from "kafkajs";
export declare class KafkaProducerService implements OnModuleInit, OnApplicationShutdown {
    private readonly kafka;
    private readonly producer;
    onModuleInit(): Promise<void>;
    onApplicationShutdown(signal?: string): Promise<void>;
    produce(message: ProducerRecord): Promise<void>;
}
