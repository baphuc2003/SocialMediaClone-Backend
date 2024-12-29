import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import * as sharp from "sharp";
import { PhotoMimeType } from "src/constants/media.enum";

@Injectable()
export class ConvertImagePipe implements PipeTransform {
  async transform(file: Express.Multer.File, metadata: ArgumentMetadata) {
    if (!file || !file.buffer) {
      throw new BadRequestException("Invalid file input.");
    }
    try {
      // Chuyển đổi file sang định dạng JPEG
      if (file.mimetype === PhotoMimeType.png) {
        const convertedBuffer = await sharp(file.buffer)
          .jpeg({ quality: 70 })
          .toBuffer();

        // Cập nhật lại buffer và mime type của file
        file.buffer = convertedBuffer;
        file.mimetype = "image/jpeg";
        file.originalname = file.originalname.replace(/\.[^.]+$/, ".jpg");
        file.size = convertedBuffer.length;
      }

      return file;
    } catch (error) {
      throw new BadRequestException("Error converting image format");
    }
  }
}
