import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { ValidationPipe } from "src/modules/users/pipes/validation.pipe";
import { UsersService } from "./users.service";
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from "@nestjs/microservices";
import { Queue } from "bullmq";
import { InjectQueue } from "@nestjs/bullmq";
import { Request, Response } from "express";
import { LoginUserDto } from "./dto/login-user.dto";
import { LoginValidationPipe } from "src/modules/users/pipes/login-validation.pipe";
import { AccessTokenGuard } from "src/modules/users/guards/access-token.guard";
import { HideInforUserInterceptor } from "src/modules/users/interceptors/hide-user-data.interceptor";
import { UserVerifyGuard } from "src/modules/users/guards/user-verify.guard";
import { CanFollowUserGuard } from "src/modules/users/guards/can-follow-user.guard";
import { FollowUserDto } from "./dto/follow-user.dto";
import { CanUnfollowUserGuard } from "src/modules/users/guards/can-unfollow-user.guard";

@Controller("user")
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    @InjectQueue("userQueue") private userQueue: Queue
  ) {}

  @UsePipes(new ValidationPipe())
  @Post("register")
  async register(@Body("user") userData: CreateUserDto, @Req() req: Request) {
    await this.userService.createUser(userData, req);
    return userData;
  }

  @UsePipes(new ValidationPipe())
  @Post("login")
  async login(@Body("user") userData: LoginUserDto, @Res() res: Response) {
    const result = await this.userService.loginUser(userData);
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", result.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 ngày,
      sameSite: "none",

      secure: true,
      httpOnly: true,
    });
    return res.status(201).json({
      message: "Login successfully!",
      data: {
        ...result,
      },
    });
  }

  @Delete("logout")
  async logout(@Res() res: Response) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({
      message: "Logout successfully!",
    });
  }

  @Post("refresh-token")
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const cookies: any = req.headers?.cookie
      ?.split(";")
      .reduce((init, cookie) => {
        const [key, value] = cookie.trim().split("=");
        init[key] = value;
        return init;
      }, {});

    const result = await this.userService.refreshToken(cookies.refreshToken);
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", result.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 ngày,
      sameSite: "none",

      secure: true,
      httpOnly: true,
    });
    return res.status(200).json({
      message: "Refresh token successfully!",
      accessToken: result,
    });
  }

  @UsePipes(new ValidationPipe())
  @Post("forgot-password")
  async forgotPassword(@Body("email") email: string, @Res() res: Response) {
    const result = await this.userService.forgotPassword(email);
    return res.status(201).json({
      message: "Please check your email!",
      data: {
        ...result,
      },
    });
  }

  @Get("get-me")
  @UseGuards(AccessTokenGuard, UserVerifyGuard)
  @UseInterceptors(HideInforUserInterceptor)
  async getMeInfo(@Req() req: Request, @Res() res: Response) {
    const userId = req.accessToken?.userId;
    const result = await this.userService.getMe(userId);
    return result;
  }

  @Get("get-profile/:username")
  @UseGuards(AccessTokenGuard, UserVerifyGuard)
  @UseInterceptors(HideInforUserInterceptor)
  async getProfile(@Param("username") username: string, @Res() res: Response) {
    console.log(username);
    const result = await this.userService.getProfile(username);
    return result;
  }

  @Post("follow")
  @UseGuards(AccessTokenGuard, UserVerifyGuard, CanFollowUserGuard)
  // @UseGuards()
  async followUser(
    @Body("following_user_id") id: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const result = await this.userService.follow(req);
    return res.status(201).json({
      message: `You have been followed  successfully!`,
      data: {
        ...result,
      },
    });
  }

  @Post("unfollow")
  @UseGuards(AccessTokenGuard, UserVerifyGuard)
  async unfollowUser(
    @Body("following_user_id") id: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const result = await this.userService.unfollow(id, req);
    return res.status(201).json({
      ...result,
    });
  }

  @Get("get-list-follow")
  @UseGuards(AccessTokenGuard, UserVerifyGuard)
  async getListFollow(@Req() req: Request, @Res() res: Response) {
    const userId = req.accessToken?.userId;
    console.log("check 181 ", userId);
    const result = await this.userService.listFollow(userId);
    return res.status(200).json({
      message: "Get list following successfully!",
      data: [...result],
    });
  }

  @Get("demo")
  @UseGuards(AccessTokenGuard)
  async demo(@Req() req: Request, @Res() res: Response) {
    return res.status(200).json("nguu");
  }
}
