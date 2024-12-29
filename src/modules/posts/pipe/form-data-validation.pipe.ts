import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
  Req,
} from "@nestjs/common";
import { CreatePostDto } from "../dto/create-post.dto";
import { PostType } from "src/constants/post.enum";
import { plainToClass } from "class-transformer";
import { validateSync, ValidatorOptions } from "class-validator";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/modules/users/entities/users.entity";
import { Repository } from "typeorm";
import { Request } from "express";

@Injectable()
export class FormDataValidationPipe implements PipeTransform {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>
    // @Req() req: Request
  ) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    console.log("check 26 ", value);
    const typePost = [
      "type",
      "userId",
      "parentId",
      "content",
      "isExistMedia",
      "view",
      "like",
      "shared",
    ];
    const valJson = JSON.parse(value.post);
    console.log("check 38 ", valJson);
    const postDTO = plainToClass(CreatePostDto, valJson, {
      enableImplicitConversion: true,
    });

    typePost.filter((attr) => {
      if (!(attr in postDTO)) {
        throw new BadRequestException(`${attr} isn't empty`);
      }
      return;
    });

    // Lưu type vào global context
    global["currentPostType"] = {
      type: postDTO.type,
      content: postDTO.content,
    };

    if (
      !postDTO.type ||
      !Object.values(PostType).includes(postDTO.type as PostType)
    ) {
      throw new BadRequestException("Type of post doesn't exists");
    }

    if (
      postDTO.type.toLocaleLowerCase() === PostType.Post.toLocaleLowerCase() ||
      postDTO.type.toLocaleLowerCase() === PostType.Comment.toLocaleLowerCase()
    ) {
      // neu ko ton tai content va media
      if (
        (postDTO.content === "" || postDTO.content == null) &&
        postDTO.isExistMedia === false
      ) {
        throw new BadRequestException("Content of post doesn't exists!");
      } else if (postDTO.content) {
        //chọn lọc hashtag nếu có
        const hashtag: string[] = postDTO.content.match(
          /(?<!\S)#([a-zA-Z0-9]+)(?!\S)/g
        );
        postDTO.hashtag = hashtag;

        // kiem tra userId
        if (postDTO.userId == null) {
          throw new BadRequestException("Attribute userId invalid!");
        }
      }
    } else if (
      postDTO.type.toLocaleLowerCase() === PostType.Repost.toLocaleLowerCase()
    ) {
      if (postDTO.isExistMedia == true) {
        throw new BadRequestException("Attribute isExistMedia invalid!");
      }

      if (postDTO.userId == null) {
        throw new BadRequestException("Attribute userId invalid!");
      }

      if (postDTO.content) {
        const hashtag: string[] = postDTO.content.match(
          /(?<!\S)#([a-zA-Z0-9]+)(?!\S)/g
        );
        postDTO.hashtag = hashtag;
      }
    }

    return postDTO;
  }
}
