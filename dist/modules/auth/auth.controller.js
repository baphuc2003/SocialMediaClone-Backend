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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const validation_pipe_1 = require("../users/pipes/validation.pipe");
const auth_service_1 = require("./auth.service");
const jwt_1 = require("../../utils/jwt");
const token_enum_1 = require("../../constants/token.enum");
const crypto_1 = require("../../utils/crypto");
const typeorm_1 = require("@nestjs/typeorm");
const public_key_entity_1 = require("../public-key/public-key.entity");
const typeorm_2 = require("typeorm");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const user_enum_1 = require("../../constants/user.enum");
const users_entity_1 = require("../users/entities/users.entity");
let AuthController = class AuthController {
    constructor(authService, publicKeyRepository, usersRepository) {
        this.authService = authService;
        this.publicKeyRepository = publicKeyRepository;
        this.usersRepository = usersRepository;
    }
    async confirmEmail(dta, req, res) {
        const { userId, token } = dta;
        console.log("check 41 ", dta);
        const result = await this.authService.verifyToken({
            userId: userId,
            token: token,
            req,
        });
        const { publicKey, privateKey } = await (0, crypto_1.generateKeyToken)();
        console.log("check 48 ", req.user);
        const [accessToken, refreshToken] = await Promise.all([
            (0, jwt_1.generateToken)({
                payload: {
                    type: token_enum_1.TokenType.AccessToken,
                    userId: userId,
                    status: user_enum_1.Status.Verified,
                },
                signature: privateKey,
                options: {
                    algorithm: "RS256",
                    expiresIn: "15m",
                },
            }),
            (0, jwt_1.generateToken)({
                payload: {
                    type: token_enum_1.TokenType.RefreshToken,
                    userId: userId,
                    status: user_enum_1.Status.Verified,
                },
                signature: privateKey,
                options: {
                    algorithm: "RS256",
                    expiresIn: "30d",
                },
            }),
            this.publicKeyRepository.update({
                userId: userId,
            }, {
                token: publicKey,
            }),
            this.usersRepository.update({ id: userId }, { status: user_enum_1.Status.Verified }),
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
    async resetPassword(dta, bdta, res) {
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
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)("confirm"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "confirmEmail", null);
__decorate([
    (0, common_1.UsePipes)(new validation_pipe_1.ValidationPipe()),
    (0, common_1.Post)("reset-password"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordQueryDto,
        reset_password_dto_1.ResetPasswordBodyDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)("auth"),
    __param(1, (0, typeorm_1.InjectRepository)(public_key_entity_1.PublicKeyEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(users_entity_1.UserEntity)),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AuthController);
//# sourceMappingURL=auth.controller.js.map