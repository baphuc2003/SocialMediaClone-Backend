import { ArgumentMetadata, PipeTransform } from "@nestjs/common";
export declare class FormFileValidation implements PipeTransform {
    transform(value: Express.Multer.File[], metadata: ArgumentMetadata): Express.Multer.File[];
}
