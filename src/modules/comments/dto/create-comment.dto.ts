import { BadRequestException } from "@nestjs/common";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateCommentDto {
  @IsOptional()
  @Transform(({ value }) => {
    if (value === "undefined" || value === undefined) {
      throw new BadRequestException("ParentId invalid");
    }
    return value === "null" || value === null ? null : value;
  })
  readonly parentId: string | null;

  @IsNotEmpty()
  @Transform(({ value }) => {
    if (value == "undefined") {
      throw new BadRequestException("Value of attribute content invalid");
    }
    return value == "null" ? null : value;
  })
  readonly content: string;

  //   @IsNotEmpty()
  postRootId: string | null;

  @IsNotEmpty()
  userRootId: string;

  readonly created_at: Date;
}
