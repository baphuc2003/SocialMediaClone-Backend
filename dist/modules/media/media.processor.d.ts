import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
export declare class MediaProcessor extends WorkerHost {
    process(job: Job, token?: string): Promise<any>;
    uploadFileToS3({ s3Client, objectCommand, }: {
        s3Client: S3Client;
        objectCommand: PutObjectCommand;
    }): Promise<void>;
}
