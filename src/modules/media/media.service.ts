import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as AWS from "aws-sdk";
import { ConfigService } from "@nestjs/config";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { IMedia } from "../posts/interface/post.interface";

@Injectable()
export class MediaService {
  private client: S3Client;
  private bucketName = this.configService.get("S3_BUCKET_NAME");

  constructor(
    private readonly configService: ConfigService,
    @InjectQueue("mediaQueue") private mediaQueue: Queue
  ) {
    const s3_region = this.configService.get("S3_REGION");
    if (!s3_region) {
      throw new Error("S3_REGION not found in environment variables");
    }

    this.client = new S3Client({
      region: s3_region,
      credentials: {
        accessKeyId: this.configService.get("S3_ACCESS_KEY"),
        secretAccessKey: this.configService.get("S3_SECRET_ACCESS_KEY"),
      },
      forcePathStyle: true,
    });
  }

  async uploadSinglePhoto({
    userId,
    fileMap,
    isPublic = true,
  }: {
    userId: string;
    fileMap: Map<string, Express.Multer.File[]>;
    isPublic?: boolean;
  }) {
    const file: Express.Multer.File = fileMap.get(userId)[0];

    try {
      const key = `${uuidv4()}`;
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: `${key}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        // ACL: isPublic ? "public-read" : "private",

        Metadata: {
          originalName: file.originalname,
        },
      });

      const uploadResult = await this.client.send(command);

      const url = `https://${this.bucketName}.s3.${this.configService.get(
        "S3_REGION"
      )}.amazonaws.com/${key}-${file.originalname}`;

      fileMap.delete(userId);

      return url;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async uploadMultiPhoto({
    userId,
    fileMap,
    isPublic = true,
  }: {
    userId: string;
    fileMap: Map<string, Express.Multer.File[]>;
    isPublic?: boolean;
  }): Promise<string[] | IMedia[]> {
    const files = fileMap.get(userId) || [];
    const result: IMedia[] = [];

    try {
      for (const file of files) {
        const key = `${uuidv4()}-${file.originalname}`;
        const command = new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
          Metadata: {
            originalName: file.originalname,
          },
        });

        // // Upload file lên S3
        await this.client.send(command);

        // Tạo URL public, sử dụng encodeURIComponent để tránh lỗi ký tự
        const encodedKey = encodeURIComponent(key); // Encode key
        const url = `https://${this.bucketName}.s3.${this.configService.get(
          "S3_REGION"
        )}.amazonaws.com/${encodedKey}`;
        console.log("check 107 ", url);
        result.push({
          type: file.mimetype.split("/")[0],
          url: url,
        });
      }

      fileMap.delete(userId); // Xóa fileMap sau khi xử lý xong
      return result; // Trả về danh sách URL
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getVideo() {}

  async uploadVideo({
    userId,
    fileMap,
  }: {
    userId: string;
    fileMap: Map<string, Express.Multer.File[]>;
  }) {
    const file: Express.Multer.File = fileMap.get(userId)[0];

    try {
      const key = `${uuidv4()}`;
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: `${key}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        // ACL: isPublic ? "public-read" : "private",

        Metadata: {
          originalName: file.originalname,
        },
      });

      // await this.mediaQueue.add("upload-video", {
      //   clientS3: this.client,
      //   objectCommand: command,
      // });
      // const uploadResult = await this.client.send(command);

      const url = `https://${this.bucketName}.s3.${this.configService.get(
        "S3_REGION"
      )}.amazonaws.com/${key}-${file.originalname}`;
      console.log("url ", url);
      fileMap.delete(userId);

      return url;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
