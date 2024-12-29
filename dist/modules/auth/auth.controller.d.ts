import { AuthService } from "./auth.service";
import { Request, Response } from "express";
import { PublicKeyEntity } from "../public-key/public-key.entity";
import { Repository } from "typeorm";
import { ResetPasswordBodyDto, ResetPasswordQueryDto } from "./dto/reset-password.dto";
export declare class AuthController {
    private readonly authService;
    private readonly publicKeyRepository;
    constructor(authService: AuthService, publicKeyRepository: Repository<PublicKeyEntity>);
    confirmEmail(dta: {
        userId: string;
        token: string;
    }, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    resetPassword(dta: ResetPasswordQueryDto, bdta: ResetPasswordBodyDto, res: Response): Promise<Response<any, Record<string, any>>>;
}
