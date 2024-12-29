import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Job } from "bullmq";

@Injectable()
@Processor("mediaQueue")
export class MediaProcessor extends WorkerHost {
  async process(job: Job, token?: string): Promise<any> {
    switch (job.name) {
      case "upload-video": {
        console.log("ngu");
        const clientS3 = job.data?.clientS3;
        const command = job.data?.objectCommand;
        await this.uploadFileToS3({
          s3Client: clientS3,
          objectCommand: command,
        });
      }
    }
  }

  async uploadFileToS3({
    s3Client,
    objectCommand,
  }: {
    s3Client: S3Client;
    objectCommand: PutObjectCommand;
  }) {
    console.log("kakaka");
    // await s3Client.send(objectCommand);
    return;
  }
}
