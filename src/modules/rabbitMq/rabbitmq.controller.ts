import { Controller, Post } from "@nestjs/common";
import { RabbitMQService } from "./rabbitmq.service";

@Controller("rabbitmq")
export class RabbitMQController {
  // Constructor
  constructor(private readonly rabbitMQService: RabbitMQService) {
    // Initialization code if needed
  }

  // Define your endpoints here
  // For example:
  @Post("example")
  async getExample() {
    return this.rabbitMQService.sendMessage(
      "demoQueue",
      "demo.created",
      "nguyen ba phuc"
    );
    //return { message: "Hello from RabbitMQ!" };
  }
}
