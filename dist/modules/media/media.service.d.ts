import { ConfigService } from "@nestjs/config";
import { Queue } from "bullmq";
import { IMedia } from "../posts/interface/post.interface";
export declare class MediaService {
    private readonly configService;
    private mediaQueue;
    private client;
    private bucketName;
    constructor(configService: ConfigService, mediaQueue: Queue);
    uploadSinglePhoto({ userId, fileMap, isPublic, }: {
        userId: string;
        fileMap: Map<string, Express.Multer.File[]>;
        isPublic?: boolean;
    }): Promise<string>;
    uploadMultiPhoto({ userId, fileMap, isPublic, }: {
        userId: string;
        fileMap: Map<string, Express.Multer.File[]>;
        isPublic?: boolean;
    }): Promise<string[] | IMedia[]>;
    getVideo(): Promise<void>;
    uploadVideo({ userId, fileMap, }: {
        userId: string;
        fileMap: Map<string, Express.Multer.File[]>;
    }): Promise<string>;
}
