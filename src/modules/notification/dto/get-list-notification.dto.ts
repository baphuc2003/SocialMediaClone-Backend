import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, IsUUID, Min } from "class-validator";

export class GetListNotificationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsUUID()
  @IsNotEmpty()
  readonly receiverId: string;
}
