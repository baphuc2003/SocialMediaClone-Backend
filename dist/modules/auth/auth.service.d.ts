import { PublicKeyEntity } from "../public-key/public-key.entity";
import { Repository } from "typeorm";
import { UserEntity } from "../users/entities/users.entity";
import { Request } from "express";
export declare class AuthService {
    private readonly publicKeyRepository;
    private readonly usersRepository;
    constructor(publicKeyRepository: Repository<PublicKeyEntity>, usersRepository: Repository<UserEntity>);
    verifyToken({ userId, token, req, }: {
        userId: string;
        token: string;
        req: Request;
    }): Promise<unknown>;
    verifyForgotPasswordToken({ userId, token, password, }: {
        userId: string;
        token: string;
        password: string;
    }): Promise<void>;
}
