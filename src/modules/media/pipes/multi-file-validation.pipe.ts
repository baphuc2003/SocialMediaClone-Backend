import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from "@nestjs/common";
import { PhotoMimeType } from "src/constants/media.enum";
import { addFileToMap } from "../data-structures/file-map";

@Injectable()
export class MultiFileValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File[], metadata: ArgumentMetadata) {
    if (!file) {
      throw new BadRequestException("File isn't empty!");
    }

    if (file.length > 5) {
      throw new BadRequestException("The maximum number of files is 4");
    }
    const oneKb = 3 * 1024 * 1024;
    // "value" is an object containing the file's attributes and metadata

    // if (file?.size > oneKb) {
    //   throw new BadRequestException("File size is large!");
    // }
    for (let i = 0; i < file.length; i++) {
      if (file[i].size > oneKb) {
        throw new BadRequestException("File size is large!");
      }
    }

    // Kiểm tra định dạng file bằng enum
    const arrPhotoMimeType: PhotoMimeType[] = Object.values(PhotoMimeType);
    file.map((f) => {
      if (!arrPhotoMimeType.includes(f.mimetype as PhotoMimeType)) {
        throw new BadRequestException(
          "Invalid image format. Only JPEG, PNG, and GIF are allowed."
        );
      }
    });

    return file;
  }
}
