import {
  Controller,
  Get,
  Header,
  HttpStatus,
  Post,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { photoMulterConfig } from "./config/photo-multer.config";
import { FileValidationPipe } from "./pipes/file-validation.pipe";
import { ConvertImagePipe } from "./pipes/convert-mime-file.pipe";
import { AccessTokenGuard } from "../users/guards/access-token.guard";
import { UserVerifyGuard } from "../users/guards/user-verify.guard";
import {
  addFileToMap,
  fileMap,
  getFilesFromMap,
} from "./data-structures/file-map";
import { Request, Response } from "express";
import { Repository } from "typeorm";
import { MediaEntity } from "./entities/media.entity";
import { MediaService } from "./media.service";
import { MultiFileValidationPipe } from "./pipes/multi-file-validation.pipe";
import { ConvertMultiImagePipe } from "./pipes/convert-multi-mime-file.pipe";
import * as fs from "fs";
import * as path from "path";
import * as streamifier from "streamifier";
import { VideoValidationPipe } from "./pipes/video-validation.pipe";

interface NetworkInformation {
  effectiveType?: string;
  rtt?: number;
  downlink?: number;
}

@Controller("media")
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post("upload-image")
  @UseInterceptors(FileInterceptor("file"))
  @UseGuards(AccessTokenGuard, UserVerifyGuard)
  async uploadImage(
    @UploadedFile(new FileValidationPipe(), new ConvertImagePipe())
    file: Express.Multer.File,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const userId = req.user?.id;
    addFileToMap(userId, file);
    const result = await this.mediaService.uploadSinglePhoto({
      userId: userId,
      fileMap: fileMap,
    });
    return res.status(201).json({
      message: "Upload single image successfully!",
      data: {
        image: result,
      },
    });
  }

  @Post("upload-multi-image")
  @UseInterceptors(FilesInterceptor("files"))
  @UseGuards(AccessTokenGuard, UserVerifyGuard)
  async uploadMultiImage(
    @UploadedFiles(new MultiFileValidationPipe(), new ConvertMultiImagePipe())
    files: Array<Express.Multer.File>,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const userId = req.user?.id;
    files.map((file) => {
      addFileToMap(userId, file);
    });

    const result = await this.mediaService.uploadMultiPhoto({
      userId: userId,
      fileMap: fileMap,
    });

    return res.status(201).json({
      message: "Upload single image successfully!",
      data: {
        image: result,
      },
    });
  }

  @Get("get-video")
  @Header("Accept-Ranges", "bytes")
  @Header("Content-Type", "video/mp4")
  @UseInterceptors(FileInterceptor("video"))
  async getVideo(
    @UploadedFile() video: Express.Multer.File,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const videoPath = path.resolve("uploads", "demo.mp4");
    const { size } = fs.statSync(videoPath);
    const chunkSize = 10 ** 6; // 1mb

    const range = req.headers.range;
    console.log("Range từ browser:", range);

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1]
        ? Math.min(parseInt(parts[1], 10), size - 1)
        : Math.min(start + chunkSize, size - 1);

      console.log(`Start: ${start}, End: ${end}, ChunkSize: ${chunkSize}`);

      const readStreamfile = fs.createReadStream(videoPath, {
        start,
        end,
        highWaterMark: 60 * 1024,
      });
      // Quan trọng: Phải set đúng headers
      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "video/mp4",
      });

      readStreamfile.pipe(res);
    } else {
      const head = {
        "Content-Length": size,
      };
      res.writeHead(HttpStatus.OK, head); //200
      fs.createReadStream(videoPath).pipe(res);
    }
  }

  @Post("upload-video")
  @UseInterceptors(FileInterceptor("video"))
  @UseGuards(AccessTokenGuard, UserVerifyGuard)
  async uploadVideo(
    @UploadedFile(new VideoValidationPipe()) video: Express.Multer.File,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const userId = req.user?.id;
    addFileToMap(userId, video);
    const result = await this.mediaService.uploadVideo({
      userId: userId,
      fileMap: fileMap,
    });

    return res.status(201).json({
      message: "Upload video successfully!",
      data: {
        video: {
          result,
        },
      },
    });
  }
}
