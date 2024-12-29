import { ArgumentMetadata, PipeTransform } from "@nestjs/common";
export declare class ConvertImagePipe implements PipeTransform {
    transform(file: Express.Multer.File, metadata: ArgumentMetadata): Promise<Express.Multer.File>;
}
