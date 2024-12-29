import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Req,
  Res,
  UsePipes,
} from "@nestjs/common";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { ValidationPipe } from "src/modules/users/pipes/validation.pipe";
import { AuthService } from "./auth.service";
import { Request, Response } from "express";
import { generateToken } from "src/utils/jwt";
import { TokenType } from "src/constants/token.enum";
import { generateKeyToken } from "src/utils/crypto";
import { InjectRepository } from "@nestjs/typeorm";
import { PublicKeyEntity } from "../public-key/public-key.entity";
import { Repository } from "typeorm";
import {
  ResetPasswordBodyDto,
  ResetPasswordQueryDto,
} from "./dto/reset-password.dto";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(PublicKeyEntity)
    private readonly publicKeyRepository: Repository<PublicKeyEntity>
  ) {}
  @Get("confirm")
  async confirmEmail(
    @Query() dta: { userId: string; token: string },
    @Req() req: Request,
    @Res() res: Response
  ) {
    const { userId, token } = dta;
    const result = await this.authService.verifyToken({
      userId: userId,
      token: token,
      req,
    });
    const { publicKey, privateKey } = await generateKeyToken();

    const [accessToken, refreshToken] = await Promise.all([
      generateToken({
        payload: {
          type: TokenType.AccessToken,
          userId: userId,
          status: req.user.status,
        },
        signature: privateKey,
        options: {
          algorithm: "RS256",
          expiresIn: "15m",
        },
      }),
      generateToken({
        payload: {
          type: TokenType.RefreshToken,
          userId: userId,
          status: req.user.status,
        },
        signature: privateKey,
        options: {
          algorithm: "RS256",
          expiresIn: "30d",
        },
      }),
      //save new public key
      this.publicKeyRepository.update(
        {
          userId: userId,
        },
        {
          token: publicKey,
        }
      ),
    ]);

    return res.status(200).json({
      message: "Authentication success!",
      data: {
        userId: userId,
        accessToken,
        refreshToken,
      },
    });
  }

  @UsePipes(new ValidationPipe())
  @Post("reset-password")
  async resetPassword(
    @Query() dta: ResetPasswordQueryDto,
    @Body() bdta: ResetPasswordBodyDto,
    @Res() res: Response
  ) {
    const { userId, token } = dta;
    console.log("check ", dta);
    console.log("check 101 ", bdta.password);
    const result = await this.authService.verifyForgotPasswordToken({
      userId: userId,
      token: token,
      password: bdta.password,
    });
    return res.status(201).json({
      message: "Reset password successfully!",
      data: result,
    });
  }
}
