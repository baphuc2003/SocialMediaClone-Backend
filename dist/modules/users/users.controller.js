"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const create_user_dto_1 = require("./dto/create-user.dto");
const validation_pipe_1 = require("./pipes/validation.pipe");
const users_service_1 = require("./users.service");
const bullmq_1 = require("bullmq");
const bullmq_2 = require("@nestjs/bullmq");
const login_user_dto_1 = require("./dto/login-user.dto");
const access_token_guard_1 = require("./guards/access-token.guard");
const hide_user_data_interceptor_1 = require("./interceptors/hide-user-data.interceptor");
const user_verify_guard_1 = require("./guards/user-verify.guard");
const can_follow_user_guard_1 = require("./guards/can-follow-user.guard");
let UsersController = class UsersController {
    constructor(userService, userQueue) {
        this.userService = userService;
        this.userQueue = userQueue;
    }
    async register(userData, req) {
        await this.userService.createUser(userData, req);
        return userData;
    }
    async login(userData, res) {
        const result = await this.userService.loginUser(userData);
        res.cookie("accessToken", result.accessToken, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 15 * 60 * 1000,
        });
        res.cookie("refreshToken", result.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
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
    async logout(res) {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res.status(200).json({
            message: "Logout successfully!",
        });
    }
    async refreshToken(req, res) {
        const cookies = req.headers?.cookie
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
            maxAge: 30 * 24 * 60 * 60 * 1000,
            sameSite: "none",
            secure: true,
            httpOnly: true,
        });
        return res.status(200).json({
            message: "Refresh token successfully!",
            accessToken: result,
        });
    }
    async forgotPassword(email, res) {
        const result = await this.userService.forgotPassword(email);
        return res.status(201).json({
            message: "Please check your email!",
            data: {
                ...result,
            },
        });
    }
    async getMeInfo(req, res) {
        const userId = req.accessToken?.userId;
        const result = await this.userService.getMe(userId);
        return result;
    }
    async getProfile(username, res) {
        console.log(username);
        const result = await this.userService.getProfile(username);
        return result;
    }
    async followUser(id, req, res) {
        const result = await this.userService.follow(req);
        return res.status(201).json({
            message: `You have been followed  successfully!`,
            data: {
                ...result,
            },
        });
    }
    async unfollowUser(id, req, res) {
        const result = await this.userService.unfollow(id, req);
        return res.status(201).json({
            ...result,
        });
    }
    async getListFollow(req, res) {
        const userId = req.accessToken?.userId;
        const result = await this.userService.listFollow(userId);
        return res.status(200).json({
            message: "Get list following successfully!",
            data: [...result],
        });
    }
    async demo(req, res) {
        return res.status(200).json("nguu");
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.UsePipes)(new validation_pipe_1.ValidationPipe()),
    (0, common_1.Post)("register"),
    __param(0, (0, common_1.Body)("user")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "register", null);
__decorate([
    (0, common_1.UsePipes)(new validation_pipe_1.ValidationPipe()),
    (0, common_1.Post)("login"),
    __param(0, (0, common_1.Body)("user")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_user_dto_1.LoginUserDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "login", null);
__decorate([
    (0, common_1.Delete)("logout"),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)("refresh-token"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.UsePipes)(new validation_pipe_1.ValidationPipe()),
    (0, common_1.Post)("forgot-password"),
    __param(0, (0, common_1.Body)("email")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Get)("get-me"),
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard, user_verify_guard_1.UserVerifyGuard),
    (0, common_1.UseInterceptors)(hide_user_data_interceptor_1.HideInforUserInterceptor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getMeInfo", null);
__decorate([
    (0, common_1.Get)("get-profile/:username"),
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard, user_verify_guard_1.UserVerifyGuard),
    (0, common_1.UseInterceptors)(hide_user_data_interceptor_1.HideInforUserInterceptor),
    __param(0, (0, common_1.Param)("username")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)("follow"),
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard, user_verify_guard_1.UserVerifyGuard, can_follow_user_guard_1.CanFollowUserGuard),
    __param(0, (0, common_1.Body)("following_user_id")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "followUser", null);
__decorate([
    (0, common_1.Post)("unfollow"),
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard, user_verify_guard_1.UserVerifyGuard),
    __param(0, (0, common_1.Body)("following_user_id")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "unfollowUser", null);
__decorate([
    (0, common_1.Get)("get-list-follow"),
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard, user_verify_guard_1.UserVerifyGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getListFollow", null);
__decorate([
    (0, common_1.Get)("demo"),
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "demo", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)("user"),
    __param(1, (0, bullmq_2.InjectQueue)("userQueue")),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        bullmq_1.Queue])
], UsersController);
//# sourceMappingURL=users.controller.js.map