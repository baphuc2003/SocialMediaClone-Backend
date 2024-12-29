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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const users_entity_1 = require("./entities/users.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const bcrypt_1 = require("../../utils/bcrypt");
const jwt_1 = require("../../utils/jwt");
const token_enum_1 = require("../../constants/token.enum");
const user_enum_1 = require("../../constants/user.enum");
const crypto_1 = require("../../utils/crypto");
const public_key_entity_1 = require("../public-key/public-key.entity");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const follow_entity_1 = require("./entities/follow.entity");
const class_validator_1 = require("class-validator");
let UsersService = class UsersService {
    constructor(usersRepository, publicKeyRepository, emailQueue, followRepository) {
        this.usersRepository = usersRepository;
        this.publicKeyRepository = publicKeyRepository;
        this.emailQueue = emailQueue;
        this.followRepository = followRepository;
    }
    async createUser(dto, req) {
        const { username, email, password, gender } = dto;
        const qb = this.usersRepository
            .createQueryBuilder("user")
            .where("user.username = :username", { username })
            .orWhere("user.email = :email", { email });
        const user = await qb.getOne();
        if (user) {
            const errors = { username: "Username and email must be unique." };
            throw new common_1.HttpException({ message: "Input data validation failed", errors }, common_1.HttpStatus.BAD_REQUEST);
        }
        const newUser = this.usersRepository.create(dto);
        await this.usersRepository.save(newUser);
        const { publicKey, privateKey } = await (0, crypto_1.generateKeyToken)();
        req.privateKey = privateKey;
        try {
            const authToken = await (0, jwt_1.generateToken)({
                payload: {
                    type: token_enum_1.TokenType.AuthToken,
                    userId: newUser.id,
                    status: user_enum_1.Status.Unverified,
                },
                signature: privateKey,
                options: {
                    algorithm: "RS256",
                    expiresIn: 60 * 30,
                },
            });
            await this.emailQueue.add("send-email", {
                email: newUser.email,
                userId: newUser.id,
                token: authToken,
            });
        }
        catch (error) {
            console.log(error);
        }
        const token = this.publicKeyRepository.create({
            userId: newUser.id,
            token: publicKey,
            created_at: new Date(),
        });
        await this.publicKeyRepository.save(token);
        return dto;
    }
    async loginUser(data) {
        const { email, password } = data;
        const user = await this.usersRepository.findOne({
            where: {
                email: email,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException("Email doesn't exists.");
        }
        const encodedPassword = await (0, bcrypt_1.comparePassword)(password, user.password);
        if (!encodedPassword) {
            throw new common_1.UnauthorizedException("Email or Password doesn't correct.");
        }
        const { publicKey, privateKey } = await (0, crypto_1.generateKeyToken)();
        const [accessToken, refreshToken] = await Promise.all([
            (0, jwt_1.generateToken)({
                payload: {
                    type: token_enum_1.TokenType.AccessToken,
                    userId: user.id,
                    status: user.status,
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
                    userId: user.id,
                    status: user.status,
                },
                signature: privateKey,
                options: {
                    algorithm: "RS256",
                    expiresIn: "30d",
                },
            }),
            this.publicKeyRepository.update({
                userId: user.id,
            }, {
                token: publicKey,
            }),
        ]);
        return {
            userId: user.id,
            accessToken,
            refreshToken,
        };
    }
    async refreshToken(token) {
        if (!token) {
            throw new common_1.BadRequestException("Refresh token doesn't empty");
        }
        const decodeToken = (await (0, jwt_1.decodedToken)(token));
        if (!decodeToken) {
            throw new common_1.BadRequestException("Refresh token invalid");
        }
        const { userId, status } = decodeToken;
        const publicKeyToken = await this.publicKeyRepository.findOne({
            where: {
                userId: userId,
            },
        });
        if (!publicKeyToken) {
            throw new common_1.NotFoundException("Not find public key");
        }
        const verifiedToken = await (0, jwt_1.verifyToken)({
            token: token,
            signature: publicKeyToken.token,
        });
        const { publicKey, privateKey } = await (0, crypto_1.generateKeyToken)();
        const [accessToken, refreshToken] = await Promise.all([
            (0, jwt_1.generateToken)({
                payload: {
                    type: token_enum_1.TokenType.AccessToken,
                    userId: userId,
                    status: status,
                },
                signature: privateKey,
                options: {
                    algorithm: "RS256",
                    expiresIn: "5s",
                },
            }),
            (0, jwt_1.generateToken)({
                payload: {
                    type: token_enum_1.TokenType.RefreshToken,
                    userId: userId,
                    status: status,
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
        ]);
        return {
            accessToken,
            refreshToken,
        };
    }
    async forgotPassword(email) {
        const user = await this.usersRepository.findOne({
            where: {
                email: email,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException("Email doesn't exists");
        }
        const { publicKey, privateKey } = await (0, crypto_1.generateKeyToken)();
        const [forgotPasswordToken] = await Promise.all([
            (0, jwt_1.generateToken)({
                payload: {
                    type: token_enum_1.TokenType.ForgotPasswordToken,
                    userId: user.id,
                    status: user.status,
                },
                signature: privateKey,
                options: {
                    algorithm: "RS256",
                    expiresIn: 5 * 60 * 1000,
                },
            }),
            this.publicKeyRepository.update({
                userId: user.id,
            }, {
                token: publicKey,
            }),
        ]);
        await this.emailQueue.add("send-forgot-password-email", {
            email: email,
            userId: user.id,
            token: forgotPasswordToken,
        });
        return {
            userId: user.id,
            "forgot-password-token": forgotPasswordToken,
        };
    }
    async getMe(userId) {
        const user = await this.usersRepository.findOne({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException("User doesnt't exists");
        }
        return user;
    }
    async getProfile(username) {
        const user = await this.usersRepository.findOne({
            where: {
                username: username,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException("User doesn't exists");
        }
        return user;
    }
    async follow(req) {
        const follow = new follow_entity_1.FollowEntity();
        follow.user = req.user;
        follow.followingUser = req.followingUser;
        follow.created_at = new Date();
        follow.user.password = "";
        follow.followingUser.password = "";
        const followed = await this.followRepository.save(follow);
        return followed;
    }
    async unfollow(following_user_id, req) {
        const userId = req.user?.id;
        if (!following_user_id) {
            throw new common_1.BadRequestException("Following user id doesn't exists!");
        }
        if (!(0, class_validator_1.isUUID)(following_user_id)) {
            throw new common_1.BadRequestException("Invalid following user id format. It must be a UUID string.");
        }
        const followingUser = await this.usersRepository.findOne({
            where: { id: following_user_id },
        });
        if (!followingUser) {
            throw new common_1.NotFoundException("User to unfollow not found");
        }
        const followRecord = await this.followRepository.findOne({
            where: {
                user: { id: userId },
                followingUser: { id: following_user_id },
            },
        });
        if (!followRecord) {
            throw new common_1.BadRequestException("You are not following this user");
        }
        await this.followRepository.remove(followRecord);
        return { message: "Unfollow successful" };
    }
    async listFollow(userId) {
        if (!userId) {
            throw new common_1.BadRequestException("UserId invalid");
        }
        const listFollowing = await this.followRepository.find({
            where: {
                user: { id: userId },
            },
        });
        return listFollowing;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(users_entity_1.UserEntity)),
    __param(1, (0, typeorm_2.InjectRepository)(public_key_entity_1.PublicKeyEntity)),
    __param(2, (0, bullmq_1.InjectQueue)("emailQueue")),
    __param(3, (0, typeorm_2.InjectRepository)(follow_entity_1.FollowEntity)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        bullmq_2.Queue,
        typeorm_1.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map