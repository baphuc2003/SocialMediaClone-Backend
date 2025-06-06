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
    console.log("check 18 ", job.name);
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
    const baseUrl = process.env.APP_URL || "http://localhost:3000";
    const confirmUrl = `${baseUrl}/api/auth/confirm?token=${token}&userId=${userId}`;
    // Gửi email với confirmUrl
    // const url = `http://${process.env.HOST_SERVER}:${process.env.PORT_SERVER}/api/auth/confirm?token=${token}&userId=${userId}`;
    console.log("check 48 url ", confirmUrl);
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: "Welcome to our service! Confirm your Email",
        template: "./confirmation",
        context: { confirmUrl },
      });
      console.log("check 61 - Mail sent successfully");
    } catch (error) {
      console.error("Error sending mail:", error);
      throw error; // Ném lỗi để BullMQ retry nếu cần
    }
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
    // const resetUrl = `http://${process.env.HOST_SERVER}:${process.env.PORT_SERVER}/api/auth/reset-password?token=${token}&userId=${userId}`;
    const baseUrl = process.env.APP_URL || "http://localhost:3000";
    const confirmUrl = `${baseUrl}/api/auth/confirm?token=${token}&userId=${userId}`;
    console.log("check 79 ", confirmUrl);
    // await this.mailerService.sendMail({
    //   to: email,
    //   subject: "Welcome to our service! Confirm your Email",
    //   template: "./forgot-password", // Đường dẫn tới file Handlebars template
    //   context: {
    //     // Truyền các biến vào template
    //     confirmUrl,
    //   },
    // });
  }

  @EventPattern("send_email")
  async handleSendEmail(data: any) {
    console.log("Email data received:", data);
    // Thực hiện gửi email ở đây
    console.log("Sending email to:", data.email);
  }
}
