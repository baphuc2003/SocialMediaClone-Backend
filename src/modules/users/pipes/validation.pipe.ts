import {
  ArgumentMetadata,
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    console.log("check 115", value);
    if (!value) {
      throw new BadRequestException("No data submitted");
    }
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);

    const errors = await validate(object);

    if (errors.length > 0) {
      const arrErrors = errors.map((err) => ({
        field: err.property,
        value: err.value,
        messageError: Object.values(err.constraints)[0],
      }));

      throw new HttpException(
        {
          message: "Input data validation failed",
          result: arrErrors,
        },
        HttpStatus.BAD_REQUEST
      );
    }
    return value;
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metatype === type);
  }
}
