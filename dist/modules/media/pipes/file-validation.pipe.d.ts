import { PipeTransform, ArgumentMetadata } from "@nestjs/common";
export declare class FileValidationPipe implements PipeTransform {
    transform(value: Express.Multer.File, metadata: ArgumentMetadata): Express.Multer.File;
}
