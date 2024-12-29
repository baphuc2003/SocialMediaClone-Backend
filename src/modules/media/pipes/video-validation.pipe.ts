import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import { VideoMimeType } from "src/constants/media.enum";

@Injectable()
export class VideoValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File, metadata: ArgumentMetadata) {
    if (!file) {
      throw new BadRequestException("File isn't empty!");
    }
    const { mimetype, size } = file;
    console.log("check file ", file);
    if (!Object.values(VideoMimeType).includes(mimetype as VideoMimeType)) {
      throw new BadRequestException(
        "Invalid video format. Only mp4 are allowed."
      );
    }
    const maxSizeVideo = 100 * 1024 * 1024;
    if (size > maxSizeVideo) {
      throw new BadRequestException("File size is large!");
    }
    return file;
  }
}
