// post.worker.ts
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { Job } from "bullmq";
import { MediaService } from "src/modules/media/media.service";
import { fileMap } from "src/modules/media/data-structures/file-map";
import { PostEntity } from "../entities/post.entity";
import { CommentGraph } from "src/modules/comments/utils/graphComment";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { GraphCommentDocument } from "src/modules/comments/schemas/graph-comment.schema";

@Processor("postQueue")
export class PostProcessor extends WorkerHost {
  constructor(
    private readonly mediaService: MediaService,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectModel("Graph_Comment")
    private graphCommentModel: Model<GraphCommentDocument>
  ) {
    super();
  }

  async process(job: Job): Promise<any> {
    console.log("Processing job:", job.name);

    const { userId, post } = job.data;

    const uploaded = await this.mediaService.uploadMultiPhoto({
      userId,
      fileMap,
    });

    post.mediaUrls = uploaded;
    post.created_at = new Date();

    const saved = await this.postRepository.save(post);
    console.log("Post saved:", saved);
    // userRootId: result?.user?.id,
    // //   postRootId: result?.id,
    const userRootId = saved?.user?.id;
    const postRootId = saved?.id;
    //Tạo mới đồ thị
    const newGraph = new CommentGraph();
    newGraph.addVertex({
      id: postRootId,
      userId: userRootId,
    });
    console.log("check 26 ", newGraph);
    const graphDoc = new this.graphCommentModel({
      userRootId: userRootId,
      postRootId: postRootId,
      graph: newGraph.adjList,
    });
    console.log("check 32 ", graphDoc);
    await graphDoc.save();
    return saved;
  }
}
