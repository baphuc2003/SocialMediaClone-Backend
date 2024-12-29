import { MailerService } from "@nestjs-modules/mailer";
import { WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
export declare class MailService extends WorkerHost {
    private readonly mailerService;
    process(job: Job, token?: string): Promise<any>;
    constructor(mailerService: MailerService);
    sendRegistrationConfirmation({ email, userId, token, }: {
        email: string;
        userId: string;
        token: string;
    }): Promise<void>;
    sendForgotPasswordConfirmation({ email, userId, token, }: {
        email: string;
        userId: string;
        token: string;
    }): Promise<void>;
    handleSendEmail(data: any): Promise<void>;
}
