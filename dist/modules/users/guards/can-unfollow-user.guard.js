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
exports.CanUnfollowUserGuard = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const class_validator_1 = require("class-validator");
const follow_entity_1 = require("../entities/follow.entity");
const users_entity_1 = require("../entities/users.entity");
const typeorm_2 = require("typeorm");
let CanUnfollowUserGuard = class CanUnfollowUserGuard {
    constructor(usersRepository, followRepository) {
        this.usersRepository = usersRepository;
        this.followRepository = followRepository;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const { following_user_id } = request.body;
        const userId = request.user?.id;
        if (!userId) {
            throw new common_1.BadRequestException("User not authenticated");
        }
        if (!following_user_id) {
            throw new common_1.BadRequestException("Following user ID is required");
        }
        if (!(0, class_validator_1.isUUID)(following_user_id)) {
            throw new common_1.BadRequestException("Invalid following user ID format. It must be a UUID string.");
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
        return true;
    }
};
exports.CanUnfollowUserGuard = CanUnfollowUserGuard;
exports.CanUnfollowUserGuard = CanUnfollowUserGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.UserEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(follow_entity_1.FollowEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CanUnfollowUserGuard);
//# sourceMappingURL=can-unfollow-user.guard.js.map