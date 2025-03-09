import { Process, Processor } from "@nestjs/bull";
import { InjectModel } from "@nestjs/mongoose";
import { Job } from "bull";
import { Model } from "mongoose";
import { GraphCommentDocument } from "../schemas/graph-comment.schema";
import { CommentGraph } from "../utils/graphComment";

@Processor("commentQueue")
export class CommentProcessor {
  constructor(
    @InjectModel("Graph_Comment")
    private graphCommentModel: Model<GraphCommentDocument>
  ) {}

  @Process("create-graphComment")
  async handleCreatePost(job: Job) {
    console.log("check 16 ", job.data);
    const userRootId = job.data?.userRootId;
    const postRootId = job.data?.postRootId;
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
    const result = await graphDoc.save();
    return result;
  }
}
