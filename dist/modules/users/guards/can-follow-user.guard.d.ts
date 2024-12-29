import { CanActivate, ExecutionContext } from "@nestjs/common";
import { FollowEntity } from "src/modules/users/entities/follow.entity";
import { UserEntity } from "src/modules/users/entities/users.entity";
import { Repository } from "typeorm";
export declare class CanFollowUserGuard implements CanActivate {
    private readonly usersRepository;
    private readonly followRepository;
    constructor(usersRepository: Repository<UserEntity>, followRepository: Repository<FollowEntity>);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
