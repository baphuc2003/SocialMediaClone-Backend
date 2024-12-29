import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { isUUID } from "class-validator";
import { Request } from "express";
import { FollowEntity } from "src/modules/users/entities/follow.entity";
import { UserEntity } from "src/modules/users/entities/users.entity";
import { Repository } from "typeorm";

@Injectable()
export class CanUnfollowUserGuard implements CanActivate {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>
  ) {}

  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const { following_user_id } = request.body;
    const userId = request.user?.id;
    if (!following_user_id) {
      throw new BadRequestException("Following user id doesn't exists!");
    }

    if (!isUUID(following_user_id)) {
      throw new BadRequestException(
        "Invalid following user id format. It must be a UUID string."
      );
    }

    const followingUser = await this.usersRepository.findOne({
      where: { id: following_user_id },
    });
    if (!followingUser) {
      throw new NotFoundException("User to unfollow not found");
    }

    const followRecord = await this.followRepository.findOne({
      where: {
        user: { id: userId },
        followingUser: { id: following_user_id },
      },
    });
    if (!followRecord) {
      throw new BadRequestException("You are not following this user");
    }

    // Xóa bản ghi follow
    await this.followRepository.remove(followRecord);
    return { message: "Unfollow successful" };
  }
}
