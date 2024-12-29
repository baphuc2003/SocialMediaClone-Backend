import { WorkerHost } from "@nestjs/bullmq";
import { Job, Queue } from "bullmq";
export declare class MailController extends WorkerHost {
    private emailQueue;
    process(job: Job, token?: string): Promise<any>;
    constructor(emailQueue: Queue);
    demo(data: any): void;
}
