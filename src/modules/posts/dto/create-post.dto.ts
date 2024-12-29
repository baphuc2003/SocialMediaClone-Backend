import { IsIn, IsNotEmpty, Max, ValidateIf } from "class-validator";
import { PostType } from "src/constants/post.enum";
import { IMedia } from "../interface/post.interface";
import { Media } from "src/constants/media.enum";
import { BadRequestException } from "@nestjs/common";
import { Transform, Type } from "class-transformer";

export class CreatePostDto {
  @IsNotEmpty()
  @IsIn([PostType.Post, PostType.Comment, PostType.Repost])
  @Type(() => String)
  type: string;

  @Transform(({ value }) =>
    value === "null" || value === undefined ? null : String(value)
  )
  userId: string;

  @Transform(({ value }) => {
    if (value == "undefined") {
      throw new BadRequestException("Value of attribute content invalid");
    }
    return value == "null" ? null : value;
  })
  @Type(() => String)
  content: string | null;

  @Transform(({ value }) => {
    if (
      typeof value === "string" &&
      value.trim() != "true" &&
      value.trim() != "false"
    ) {
      throw new BadRequestException(
        `Value of attribute isExistMedia must be a boolean`
      );
    } else {
      return value === true ? true : false;
    }
  })
  isExistMedia: boolean;

  @Transform(({ value }) => {
    if (typeof value === "number" && !isNaN(value)) {
      if (value != 0) {
        throw new BadRequestException("Value of attribute view must be 0");
      }
      return 0;
    } else {
      throw new BadRequestException(`Value of attribute view must be a number`);
    }
  })
  @Type(() => Number)
  view: number;

  hashtag: string[] | null;

  mediaUrls: string[] | null;

  @Transform(({ value }) => {
    if (typeof value === "number" && !isNaN(value)) {
      if (value != 0) {
        throw new BadRequestException("Value of attribute view must be 0");
      }
      return 0;
    } else {
      throw new BadRequestException(`Value of attribute view must be a number`);
    }
  })
  @Type(() => Number)
  like: number;

  @Transform(({ value }) => {
    if (typeof value === "number" && !isNaN(value)) {
      if (value != 0) {
        throw new BadRequestException("Value of attribute view must be 0");
      }
      return 0;
    } else {
      throw new BadRequestException(`Value of attribute view must be a number`);
    }
  })
  @Type(() => Number)
  shared: number;

  @Type(() => Date)
  created_at: Date;
}
