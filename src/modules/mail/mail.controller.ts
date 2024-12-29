import { InjectQueue, Processor, WorkerHost } from "@nestjs/bullmq";
import { Controller, Get, OnModuleInit } from "@nestjs/common";
import { EventPattern, MessagePattern, Payload } from "@nestjs/microservices";
import { Job, Queue } from "bullmq";

@Processor("emailQueue")
@Controller("mail")
export class MailController extends WorkerHost {
  process(job: Job, token?: string): Promise<any> {
    console.log("check 15 ", job.name);
    switch (job.name) {
      case "send-email": {
        console.log(job.data);
        return;
      }
    }
  }
  constructor(@InjectQueue("emailQueue") private emailQueue: Queue) {
    super();
  }

  //   @EventPattern("demo")
  @MessagePattern({ cmd: "demo1" })
  demo(data: any) {
    console.log("check 8 ", data);
  }
}
