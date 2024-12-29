import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { PublicKeyEntity } from "src/modules/public-key/public-key.entity";
import { UserEntity } from "src/modules/users/entities/users.entity";
import { Repository } from "typeorm";
export declare class AccessTokenGuard implements CanActivate {
    private readonly publicKeyRepository;
    private readonly usersRepository;
    constructor(publicKeyRepository: Repository<PublicKeyEntity>, usersRepository: Repository<UserEntity>);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
    private extractTokenFromHeader;
}
