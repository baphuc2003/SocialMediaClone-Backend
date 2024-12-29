import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { fileMap } from "src/modules/media/data-structures/file-map";
import { MediaService } from "src/modules/media/media.service";
import { CreatePostDto } from "../dto/create-post.dto";
import { PostEntity } from "../entities/post.entity";
import { IMedia } from "../interface/post.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/modules/users/entities/users.entity";
import { Repository } from "typeorm";

@Processor("postQueue")
export class PostProcessor {
  constructor(
    private readonly mediaService: MediaService,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>
  ) {}

  @Process("create-post")
  async handleCreatePost(job: Job) {
    const userId = job.data?.userId;
    const post: PostEntity = job.data.post;
    const result: IMedia[] = (await this.mediaService.uploadMultiPhoto({
      userId: userId,
      fileMap: fileMap,
    })) as IMedia[];
    post.mediaUrls = result;
    post.created_at = new Date();

    //save db
    await this.postRepository.save(post);
    return post;
  }
}
