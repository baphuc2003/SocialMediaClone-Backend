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
exports.AccessTokenGuard = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const public_key_entity_1 = require("../../public-key/public-key.entity");
const users_entity_1 = require("../entities/users.entity");
const jwt_1 = require("../../../utils/jwt");
const typeorm_2 = require("typeorm");
let AccessTokenGuard = class AccessTokenGuard {
    constructor(publicKeyRepository, usersRepository) {
        this.publicKeyRepository = publicKeyRepository;
        this.usersRepository = usersRepository;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token?.accessToken) {
            throw new common_1.UnauthorizedException("Please login again");
        }
        try {
            const decodedAccessToken = (await (0, jwt_1.decodedToken)(token?.accessToken));
            if (!decodedAccessToken) {
                throw new common_1.UnauthorizedException("Access token invalid");
            }
            const { userId } = decodedAccessToken;
            const [user, publicKey] = await Promise.all([
                this.usersRepository.findOne({
                    where: {
                        id: userId,
                    },
                }),
                this.publicKeyRepository.findOne({
                    where: {
                        userId: userId,
                    },
                }),
            ]);
            if (!user) {
                throw new common_1.NotFoundException("User not found");
            }
            if (!publicKey) {
                throw new common_1.NotFoundException("Public key doesn't exist");
            }
            request.user = user;
            const verifiedAccessToken = (await (0, jwt_1.verifyToken)({
                token: token.accessToken,
                signature: publicKey.token,
            }));
            request.accessToken = verifiedAccessToken;
            return true;
        }
        catch (error) {
            console.log("check error: ", error);
            if (error.message?.includes("jwt expired")) {
                throw new common_1.GoneException("Need to refresh token");
            }
            throw new common_1.UnauthorizedException("Please Login Again!");
        }
    }
    extractTokenFromHeader(request) {
        const cookies = request.headers.cookie
            ?.split(";")
            .reduce((init, cookie) => {
            const [key, value] = cookie.trim().split("=");
            init[key] = value;
            return init;
        }, {});
        return cookies;
    }
};
exports.AccessTokenGuard = AccessTokenGuard;
exports.AccessTokenGuard = AccessTokenGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(public_key_entity_1.PublicKeyEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(users_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AccessTokenGuard);
//# sourceMappingURL=access-token.guard.js.map