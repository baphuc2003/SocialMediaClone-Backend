import { ArgumentMetadata, PipeTransform } from "@nestjs/common";
export declare class ConvertMultiImagePipe implements PipeTransform {
    transform(files: Express.Multer.File[], metadata: ArgumentMetadata): Promise<Express.Multer.File[]>;
}
