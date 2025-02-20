import { KafkaProducerService } from "./kafka.producer.service";
export declare class KafkaController {
    private readonly kafkaProducerService;
    constructor(kafkaProducerService: KafkaProducerService);
    sendMessage(message: any): Promise<{
        message: string;
    }>;
}
