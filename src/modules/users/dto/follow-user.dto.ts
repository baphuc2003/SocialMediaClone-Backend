import { IsNotEmpty, IsUUID } from "class-validator";

export class FollowUserDto {
  @IsUUID()
  @IsNotEmpty()
  readonly userId: string;

  @IsUUID()
  @IsNotEmpty()
  readonly followingUserId: string;
}
