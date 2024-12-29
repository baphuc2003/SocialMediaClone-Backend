import { CreateUserDto } from "./dto/create-user.dto";
import { UserEntity } from "./entities/users.entity";
import { Repository } from "typeorm";
import { PublicKeyEntity } from "../public-key/public-key.entity";
import { Queue } from "bullmq";
import { Request } from "express";
import { LoginUserDto } from "./dto/login-user.dto";
import { FollowEntity } from "./entities/follow.entity";
export declare class UsersService {
    private readonly usersRepository;
    private readonly publicKeyRepository;
    private emailQueue;
    private readonly followRepository;
    constructor(usersRepository: Repository<UserEntity>, publicKeyRepository: Repository<PublicKeyEntity>, emailQueue: Queue, followRepository: Repository<FollowEntity>);
    createUser(dto: CreateUserDto, req: Request): Promise<CreateUserDto>;
    loginUser(data: LoginUserDto): Promise<{
        userId: string;
        accessToken: unknown;
        refreshToken: unknown;
    }>;
    refreshToken(token: string): Promise<{
        accessToken: unknown;
        refreshToken: unknown;
    }>;
    forgotPassword(email: string): Promise<{
        userId: string;
        "forgot-password-token": unknown;
    }>;
    getMe(userId: string): Promise<UserEntity>;
    getProfile(username: string): Promise<UserEntity>;
    follow(req: Request): Promise<FollowEntity>;
    unfollow(following_user_id: string, req: Request): Promise<{
        message: string;
    }>;
    listFollow(userId: string): Promise<FollowEntity[]>;
}
