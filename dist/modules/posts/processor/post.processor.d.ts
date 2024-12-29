import { Job } from "bull";
import { MediaService } from "src/modules/media/media.service";
import { PostEntity } from "../entities/post.entity";
import { Repository } from "typeorm";
export declare class PostProcessor {
    private readonly mediaService;
    private readonly postRepository;
    constructor(mediaService: MediaService, postRepository: Repository<PostEntity>);
    handleCreatePost(job: Job): Promise<PostEntity>;
}
