import { IsNotEmpty, IsString } from "class-validator";

// DTO cho query params
export class ResetPasswordQueryDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}

// DTO cho request body
export class ResetPasswordBodyDto {
  @IsString()
  @IsNotEmpty()
  password: string;
}
