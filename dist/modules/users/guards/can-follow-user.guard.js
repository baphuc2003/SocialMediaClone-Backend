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
exports.CanFollowUserGuard = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const class_validator_1 = require("class-validator");
const user_enum_1 = require("../../../constants/user.enum");
const follow_entity_1 = require("../entities/follow.entity");
const users_entity_1 = require("../entities/users.entity");
const typeorm_2 = require("typeorm");
let CanFollowUserGuard = class CanFollowUserGuard {
    constructor(usersRepository, followRepository) {
        this.usersRepository = usersRepository;
        this.followRepository = followRepository;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const { following_user_id } = request.body;
        if (!following_user_id) {
            throw new common_1.BadRequestException("Following user id doesn't exists!");
        }
        if (!(0, class_validator_1.isUUID)(following_user_id)) {
            throw new common_1.BadRequestException("Invalid following user id format. It must be a UUID string.");
        }
        const userId = request.user?.id;
        const alreadyFollow = await this.followRepository.findOne({
            where: {
                user: { id: userId },
                followingUser: { id: following_user_id },
            },
        });
        if (alreadyFollow) {
            throw new common_1.BadRequestException("You are already following this user");
        }
        if (userId === following_user_id) {
            throw new common_1.BadRequestException("You cannot follow yourself");
        }
        const followingUser = await this.usersRepository.findOne({
            where: {
                id: following_user_id,
            },
        });
        if (!followingUser) {
            throw new common_1.NotFoundException("Following user not found!");
        }
        request.followingUser = followingUser;
        if (followingUser.status === user_enum_1.Status.Banned) {
            throw new common_1.ForbiddenException("Cannot follow a banned user");
        }
        return true;
    }
};
exports.CanFollowUserGuard = CanFollowUserGuard;
exports.CanFollowUserGuard = CanFollowUserGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.UserEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(follow_entity_1.FollowEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CanFollowUserGuard);
//# sourceMappingURL=can-follow-user.guard.js.map