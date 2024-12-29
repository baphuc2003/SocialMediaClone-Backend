import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";
import { Queue } from "bullmq";
import { Request, Response } from "express";
import { LoginUserDto } from "./dto/login-user.dto";
export declare class UsersController {
    private readonly userService;
    private userQueue;
    constructor(userService: UsersService, userQueue: Queue);
    register(userData: CreateUserDto, req: Request): Promise<CreateUserDto>;
    login(userData: LoginUserDto, res: Response): Promise<Response<any, Record<string, any>>>;
    logout(res: Response): Promise<Response<any, Record<string, any>>>;
    refreshToken(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    forgotPassword(email: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getMeInfo(req: Request, res: Response): Promise<import("./entities/users.entity").UserEntity>;
    getProfile(username: string, res: Response): Promise<import("./entities/users.entity").UserEntity>;
    followUser(id: string, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    unfollowUser(id: string, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getListFollow(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    demo(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
