import { ArgumentMetadata, PipeTransform } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/modules/users/entities/users.entity";
import { Repository } from "typeorm";

export class LoginValidationPipe implements PipeTransform {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>
  ) {}
  transform(value: any, metadata: ArgumentMetadata) {
    console.log("check 5 ", value);
    return value;
  }
}
