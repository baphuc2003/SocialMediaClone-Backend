import { IsNotEmpty, IsUUID } from "class-validator";

export class MakeFriendDto {
  @IsUUID()
  @IsNotEmpty()
  readonly senderId: string;

  @IsUUID()
  @IsNotEmpty()
  readonly receiverId: string;
}
