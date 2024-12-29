import { Request, Response } from "express";
import { MediaService } from "./media.service";
export declare class MediaController {
    private readonly mediaService;
    constructor(mediaService: MediaService);
    uploadImage(file: Express.Multer.File, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    uploadMultiImage(files: Array<Express.Multer.File>, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getVideo(video: Express.Multer.File, req: Request, res: Response): Promise<void>;
    uploadVideo(video: Express.Multer.File, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
