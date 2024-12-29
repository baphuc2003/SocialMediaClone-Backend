import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { isUUID } from "class-validator";
import { Request } from "express";
import { Status } from "src/constants/user.enum";
import { FollowEntity } from "src/modules/users/entities/follow.entity";
import { UserEntity } from "src/modules/users/entities/users.entity";
import { Repository } from "typeorm";

@Injectable()
export class CanFollowUserGuard implements CanActivate {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>
  ) {}
  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const { following_user_id } = request.body;

    if (!following_user_id) {
      throw new BadRequestException("Following user id doesn't exists!");
    }

    if (!isUUID(following_user_id)) {
      throw new BadRequestException(
        "Invalid following user id format. It must be a UUID string."
      );
    }
    const userId = request.user?.id;
    const alreadyFollow = await this.followRepository.findOne({
      where: {
        user: { id: userId },
        followingUser: { id: following_user_id },
      },
    });

    if (alreadyFollow) {
      throw new BadRequestException("You are already following this user");
    }

    if (userId === following_user_id) {
      throw new BadRequestException("You cannot follow yourself");
    }

    //check following user have been existed!
    const followingUser = await this.usersRepository.findOne({
      where: {
        id: following_user_id,
      },
    });

    if (!followingUser) {
      throw new NotFoundException("Following user not found!");
    }
    request.followingUser = followingUser;
    //check status of following_user
    if (followingUser.status === Status.Banned) {
      throw new ForbiddenException("Cannot follow a banned user");
    }

    return true;
  }
}
