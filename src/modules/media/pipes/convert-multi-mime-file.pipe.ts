import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import * as sharp from "sharp";
import { PhotoMimeType } from "src/constants/media.enum";

@Injectable()
export class ConvertMultiImagePipe implements PipeTransform {
  async transform(files: Express.Multer.File[], metadata: ArgumentMetadata) {
    if (!files) {
      throw new BadRequestException("Invalid file input.");
    }

    try {
      // Chuyển đổi file sang định dạng JPEG

      for (const file of files) {
        if (file.mimetype === PhotoMimeType.png) {
          // Chuyển đổi file sang định dạng JPEG
          const convertedBuffer = await sharp(file.buffer)
            .jpeg({ quality: 70 })
            .toBuffer();

          // Cập nhật lại buffer và mime type của file
          file.buffer = convertedBuffer;
          file.mimetype = "image/jpeg";
          file.originalname = file.originalname.replace(/\.[^.]+$/, ".jpg");
          file.size = convertedBuffer.length;
        }
      }
      return files;
    } catch (error) {
      throw new BadRequestException("Error converting image format");
    }
  }
}
