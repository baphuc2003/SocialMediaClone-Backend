import { Body, Controller, Post } from "@nestjs/common";
import { KafkaProducerService } from "./kafka.producer.service";

@Controller("kafka")
export class KafkaController {
  constructor(private readonly kafkaProducerService: KafkaProducerService) {}

  @Post()
  async sendMessage(@Body() message: any) {
    await this.kafkaProducerService.produce({
      topic: "test",
      messages: [{ value: "nguyen ba phuc" }],
    });
    return { message: "Message sent successfully" };
  }
}
