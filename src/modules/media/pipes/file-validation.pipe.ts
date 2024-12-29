import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from "@nestjs/common";
import { PhotoMimeType } from "src/constants/media.enum";
import { addFileToMap } from "../data-structures/file-map";

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException("File isn't empty!");
    }
    const oneKb = 3 * 1024 * 1024;
    // "value" is an object containing the file's attributes and metadata

    if (value?.size > oneKb) {
      throw new BadRequestException("File size is large!");
    }

    // Kiểm tra định dạng file bằng enum
    if (
      !Object.values(PhotoMimeType).includes(value?.mimetype as PhotoMimeType)
    ) {
      throw new BadRequestException(
        "Invalid image format. Only JPEG, PNG, and GIF are allowed."
      );
    }
    // addFileToMap()
    return value;
  }
}

// check 7  {
//     fieldname: 'file',
//     originalname: '204858072_An Suong - Quang Ngai_18_00_2024-09-28_A08.png',
//     encoding: '7bit',
//     mimetype: 'image/png',
//     destination: '/var/folders/gb/8bw9fw2s4nb5l7y5rfyd87z80000gn/T',
//     filename: '1731861113529-204858072_An_Suong_-_Quang_Ngai_18_00_2024-09-28_A08.png',
//     path: '/var/folders/gb/8bw9fw2s4nb5l7y5rfyd87z80000gn/T/1731861113529-204858072_An_Suong_-_Quang_Ngai_18_00_2024-09-28_A08.png',
//     size: 3284
//   }
