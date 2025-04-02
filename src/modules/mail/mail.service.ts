import { MailerService } from "@nestjs-modules/mailer";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from "@nestjs/microservices";
import { Job } from "bullmq";
import { join } from "path";

@Injectable()
@Processor("emailQueue")
export class MailService extends WorkerHost {
  async process(job: Job, token?: string): Promise<any> {
    switch (job.name) {
      case "send-email": {
        console.log("check 20");
        await this.sendRegistrationConfirmation(job.data);
        return;
      }

      case "send-forgot-password-email": {
        console.log(1);
        await this.sendForgotPasswordConfirmation(job.data);
        return;
      }
    }
    return;
  }
  constructor(private readonly mailerService: MailerService) {
    super();
  }

  async sendRegistrationConfirmation({
    email,
    userId,
    token,
  }: {
    email: string;
    userId: string;
    token: string;
  }) {
    // Xử lý logic gửi mail tại đây
    const url = `http://${process.env.HOST_SERVER}:${process.env.PORT_SERVER}/api/auth/confirm?token=${token}&userId=${userId}`;
    console.log("check 48 url ", url);
    await this.mailerService.sendMail({
      to: email,
      subject: "Welcome to our service! Confirm your Email",
      template: "./confirmation", // Đường dẫn tới file Handlebars template
      context: {
        // Truyền các biến vào template
        url,
      },
    });
  }

  async sendForgotPasswordConfirmation({
    email,
    userId,
    token,
  }: {
    email: string;
    userId: string;
    token: string;
  }) {
    // Xử lý logic gửi mail tại đây
    const resetUrl = `http://${process.env.HOST_SERVER}:${process.env.PORT_SERVER}/api/auth/reset-password?token=${token}&userId=${userId}`;
    await this.mailerService.sendMail({
      to: email,
      subject: "Welcome to our service! Confirm your Email",
      template: "./forgot-password", // Đường dẫn tới file Handlebars template
      context: {
        // Truyền các biến vào template
        resetUrl,
      },
    });
  }

  @EventPattern("send_email")
  async handleSendEmail(data: any) {
    console.log("Email data received:", data);
    // Thực hiện gửi email ở đây
    console.log("Sending email to:", data.email);
  }
}
