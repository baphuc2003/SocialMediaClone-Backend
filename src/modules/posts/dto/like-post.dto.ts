import { IsNotEmpty, IsUUID } from "class-validator";

export class LikePostDto {
  @IsNotEmpty()
  postId: string;
}
