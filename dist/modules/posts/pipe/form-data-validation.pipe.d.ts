import { ArgumentMetadata, PipeTransform } from "@nestjs/common";
import { CreatePostDto } from "../dto/create-post.dto";
import { UserEntity } from "src/modules/users/entities/users.entity";
import { Repository } from "typeorm";
export declare class FormDataValidationPipe implements PipeTransform {
    private readonly usersRepository;
    constructor(usersRepository: Repository<UserEntity>);
    transform(value: any, metadata: ArgumentMetadata): Promise<CreatePostDto>;
}
