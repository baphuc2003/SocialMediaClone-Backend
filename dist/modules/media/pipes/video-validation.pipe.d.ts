import { ArgumentMetadata, PipeTransform } from "@nestjs/common";
export declare class VideoValidationPipe implements PipeTransform {
    transform(file: Express.Multer.File, metadata: ArgumentMetadata): Express.Multer.File;
}
