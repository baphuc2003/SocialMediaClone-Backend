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
import { Status } from "src/constants/user.enum";
import { UserEntity } from "../users/entities/users.entity";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(PublicKeyEntity)
    private readonly publicKeyRepository: Repository<PublicKeyEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>
  ) {}
  @Get("confirm")
  async confirmEmail(
    @Query() dta: { userId: string; token: string },
    @Req() req: Request,
    @Res() res: Response
  ) {
    const { userId, token } = dta;
    console.log("check 41 ", dta);
    const frontendUrl = "http://localhost:5173/login";
    try {
      await this.authService.verifyToken({
        userId: userId,
        token: token,
        req,
      });
    } catch (error) {
      const errorTemplate = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Xác thực email thất bại</title>
      <style>
        body { font-family: Arial, sans-serif; background-color: #000000; color: #f0f8ff; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .container { text-align: center; padding: 20px; border-radius: 8px; background-color: #1c2526; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); max-width: 500px; }
        h1 { font-size: 24px; margin-bottom: 20px; }
        p { font-size: 16px; margin-bottom: 30px; }
        a { display: inline-block; padding: 10px 20px; background-color: #1d9bf0; color: #f0f8ff; text-decoration: none; border-radius: 24px; font-size: 16px; transition: background-color 0.3s; }
        a:hover { background-color: #F3453F; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Xác thực email thất bại</h1>
        <p>Link xác thực không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.</p>
        <a href="${frontendUrl}">Đăng nhập</a>
      </div>
    </body>
    </html>
  `;
      return res.status(400).send(errorTemplate);
    }
    // const { publicKey, privateKey } = await generateKeyToken();
    // console.log("check 48 ", req.user);
    // const [accessToken, refreshToken] = await Promise.all([
    //   generateToken({
    //     payload: {
    //       type: TokenType.AccessToken,
    //       userId: userId,
    //       status: Status.Verified,
    //     },
    //     signature: privateKey,
    //     options: {
    //       algorithm: "RS256",
    //       expiresIn: "15m",
    //     },
    //   }),
    //   generateToken({
    //     payload: {
    //       type: TokenType.RefreshToken,
    //       userId: userId,
    //       status: Status.Verified,
    //     },
    //     signature: privateKey,
    //     options: {
    //       algorithm: "RS256",
    //       expiresIn: "30d",
    //     },
    //   }),
    //   //save new public key
    //   this.publicKeyRepository.update(
    //     {
    //       userId: userId,
    //     },
    //     {
    //       token: publicKey,
    //     }
    //   ),
    //   this.usersRepository.update({ id: userId }, { status: Status.Verified }),
    // ]);

    // Cập nhật trạng thái người dùng thành Verified
    await this.usersRepository.update(
      { id: userId },
      { status: Status.Verified }
    );

    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Xác thực email thành công</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #000000;
            color: #f0f8ff;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .container {
            text-align: center;
            padding: 20px;
            border-radius: 8px;
            background-color: #1c2526;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            max-width: 500px;
          }
          h1 {
            font-size: 24px;
            margin-bottom: 20px;
          }
          p {
            font-size: 16px;
            margin-bottom: 30px;
          }
          a {
            display: inline-block;
            padding: 10px 20px;
            background-color: #1d9bf0;
            color: #f0f8ff;
            text-decoration: none;
            border-radius: 24px;
            font-size: 16px;
            transition: background-color 0.3s;
          }
          a:hover {
            background-color: #F3453F;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Xác thực email thành công!</h1>
          <p>Tài khoản của bạn đã được xác thực. Vui lòng đăng nhập để tiếp tục.</p>
          <a href="${frontendUrl}">Đăng nhập</a>
        </div>
      </body>
      </html>
    `;

    // Trả về template HTML
    return res.status(200).send(htmlTemplate);
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
