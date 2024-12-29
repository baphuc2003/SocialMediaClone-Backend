import { ArgumentMetadata, PipeTransform } from "@nestjs/common";
import { UserEntity } from "src/modules/users/entities/users.entity";
import { Repository } from "typeorm";
export declare class LoginValidationPipe implements PipeTransform {
    private readonly usersRepository;
    constructor(usersRepository: Repository<UserEntity>);
    transform(value: any, metadata: ArgumentMetadata): any;
}
