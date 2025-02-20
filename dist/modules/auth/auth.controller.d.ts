import { AuthService } from "./auth.service";
import { Request, Response } from "express";
import { PublicKeyEntity } from "../public-key/public-key.entity";
import { Repository } from "typeorm";
import { ResetPasswordBodyDto, ResetPasswordQueryDto } from "./dto/reset-password.dto";
import { UserEntity } from "../users/entities/users.entity";
export declare class AuthController {
    private readonly authService;
    private readonly publicKeyRepository;
    private readonly usersRepository;
    constructor(authService: AuthService, publicKeyRepository: Repository<PublicKeyEntity>, usersRepository: Repository<UserEntity>);
    confirmEmail(dta: {
        userId: string;
        token: string;
    }, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    resetPassword(dta: ResetPasswordQueryDto, bdta: ResetPasswordBodyDto, res: Response): Promise<Response<any, Record<string, any>>>;
}
