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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("../../utils/jwt");
const public_key_entity_1 = require("../public-key/public-key.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const users_entity_1 = require("../users/entities/users.entity");
const user_enum_1 = require("../../constants/user.enum");
const bcrypt_1 = require("../../utils/bcrypt");
let AuthService = class AuthService {
    constructor(publicKeyRepository, usersRepository) {
        this.publicKeyRepository = publicKeyRepository;
        this.usersRepository = usersRepository;
    }
    async verifyToken({ userId, token, req, }) {
        const publicKey = await this.publicKeyRepository.findOne({
            where: {
                userId: userId,
            },
        });
        console.log("check 41 ", publicKey);
        req.publicKey = publicKey;
        try {
            const decoded = await (0, jwt_1.verifyToken)({ token, signature: publicKey.token });
            await this.usersRepository.update({ id: userId }, { status: user_enum_1.Status.Verified, updated_at: new Date() });
            const user = await this.usersRepository.findOne({
                where: {
                    id: userId,
                },
            });
            req.user = user;
            return decoded;
        }
        catch (error) {
            if (error.message?.includes("jwt expired")) {
                return new common_1.GoneException("Token expried. Need to refresh token");
            }
            return new common_1.UnauthorizedException("Please login again");
        }
    }
    async verifyForgotPasswordToken({ userId, token, password, }) {
        const publicKey = await this.publicKeyRepository.findOne({
            where: {
                userId: userId,
            },
        });
        if (!publicKey) {
            throw new common_1.UnauthorizedException("User id doesn't correct");
        }
        try {
            const decodedToken = await (0, jwt_1.verifyToken)({
                token,
                signature: publicKey.token,
            });
            const hashed = await (0, bcrypt_1.hashPassword)(password);
            console.log("new hash password ", hashed);
            await this.usersRepository.update({
                id: userId,
            }, {
                password: hashed,
            });
        }
        catch (error) {
            console.log(error);
            if (error.message?.includes("jwt expired")) {
                throw new common_1.GoneException("Token expried. Need to refresh token");
            }
            throw new common_1.UnauthorizedException("Please login again");
        }
        return;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(public_key_entity_1.PublicKeyEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(users_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map