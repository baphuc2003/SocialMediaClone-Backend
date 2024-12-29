import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import { PostType } from "src/constants/post.enum";

interface postType {
  type: string;
  content: string;
}

@Injectable()
export class FormFileValidation implements PipeTransform {
  transform(value: Express.Multer.File[], metadata: ArgumentMetadata) {
    console.log("check val ", value);
    // Lấy type từ global context
    const postType: postType = global["currentPostType"];

    if (
      (postType?.type.toLocaleLowerCase() ==
        PostType.Post.toLocaleLowerCase() ||
        postType?.type.toLocaleLowerCase() ==
          PostType.Comment.toLocaleLowerCase()) &&
      postType.content == null
    ) {
      if (!value) {
        throw new BadRequestException("Content of post doesn't exists!");
      }
    } else if (
      postType?.type.toLocaleLowerCase() == PostType.Repost.toLocaleLowerCase()
    ) {
      if (value.length > 0) {
        throw new BadRequestException("Photos or videos cannot be attached");
      }
    }

    return value;
  }
}
