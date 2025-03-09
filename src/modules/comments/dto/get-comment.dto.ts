import { BadRequestException } from "@nestjs/common";
import { Transform } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class GetCommentDto {
  readonly parentId: string | null;

  @IsNotEmpty()
  readonly postRootId: string;

  //   @IsNotEmpty()
  @Transform(({ value }) => {
    if (value == "undefined") {
      throw new BadRequestException("Value of attribute content invalid");
    }
    return value == "null" || value == null ? null : value;
  })
  startRootId: string | null;
}
