import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Comment, CommentDocument } from "./schemas/comment.schema";
import { Model } from "mongoose";
import { CreateCommentDto } from "./dto/create-comment.dto";
import {
  GraphComment,
  GraphCommentDocument,
} from "./schemas/graph-comment.schema";
import { CommentGraph } from "./utils/graphComment";
import { Types } from "mongoose";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../users/entities/users.entity";
import { In, Repository } from "typeorm";

// interface IGraphComment {
//     userRootId:string,
//     commentRootId : string,
//     graph : {

//     }
// }

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel("Graph_Comment")
    private graphCommentModel: Model<GraphCommentDocument>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectQueue("commentQueue") private commentQueue: Queue
  ) {}

  async createComment({
    userId,
    content,
    postRootId,
    userRootId,
    parentId,
  }: {
    userId: string; // người tạo ra comment
    content: string;
    postRootId: string; // id của bài viết gốc tạo ra đồ thị.
    userRootId: string; // id cuả user mà comment hướng tới
    parentId: string | null; // id của comment cha
  }): Promise<Comment> {
    const isExistedGraph = await this.checkGraphComment({
      postRootId: postRootId,
    });

    if (!isExistedGraph) {
      throw new NotFoundException("Not found a graph!");
    }

    //kiểm tra comment này có trỏ về comment parent nào nữa hay ko ??

    if (parentId && parentId !== "null") {
      if (!Types.ObjectId.isValid(parentId)) {
        throw new BadRequestException(`ParentId invalid: ${parentId}`);
      }
      const commentParent = await this.commentModel.findOne({
        _id: new Types.ObjectId(parentId),
      });

      if (!commentParent) {
        throw new NotFoundException("Not found the parentId");
      }
    }
    const newComment = new this.commentModel({
      userId: userId,
      parentId: parentId,
      postRootId: postRootId,
      content: content,
      replyCount: 0,
      created_at: new Date(),
    });
    console.log("check 84 ", newComment);
    const savedComment = await newComment.save();
    const insertedId = savedComment._id.toString();
    //cập nhật reply count
    if (parentId && parentId !== "null") {
      await this.commentModel.updateOne(
        { _id: parentId },
        { $inc: { replyCount: 1 } }
      );
    }
    const graph = new CommentGraph();
    for (const [id, vertex] of Object.entries(isExistedGraph.graph)) {
      graph.adjList.set(id, vertex);
    }

    const updatedToGraph = graph.addEdge(
      {
        id: parentId && parentId !== "null" ? parentId : postRootId,
        userId: userRootId,
      },
      { id: insertedId, userId: userId }
    );

    await this.graphCommentModel.updateOne(
      {
        userRootId: userRootId,
        postRootId: postRootId,
      },
      {
        $set: {
          graph: updatedToGraph.adjList,
        },
      }
    );

    return newComment;
  }

  async getComment({
    postRootId,
    startRootId,
  }: {
    postRootId: string;
    startRootId: string;
  }) {
    const isExistedGraph = await this.checkGraphComment({
      postRootId: postRootId,
    });

    if (!isExistedGraph) {
      throw new NotFoundException("Not found a graph!");
    }

    const graph = new CommentGraph();
    for (const [id, vertex] of Object.entries(isExistedGraph?.graph)) {
      graph.adjList.set(id, vertex);
    }

    //dùng DFS quét các node cấp 1
    const listNode = graph.DFS(graph, startRootId);

    const objectIdArray = listNode.map((id) => new Types.ObjectId(id));
    const comments = await this.commentModel.find({
      _id: { $in: objectIdArray },
    });
    // Lấy danh sách userId duy nhất từ bình luận
    const userIds = [...new Set(comments.map((comment) => comment.userId))];
    console.log("check 143 ", userIds);
    const listInfoUser = await this.usersRepository.find({
      where: {
        id: In(userIds),
      },
      select: ["id", "username", "gender", "image"],
    });
    const userMap = new Map(listInfoUser.map((user) => [user.id, user]));
    const result = comments.map((comment) => ({
      ...comment.toObject(),
      user: userMap.get(comment.userId) || null,
      replyCount: comment.replyCount || 0,
    }));
    console.log("check 154 ", listInfoUser);
    return result;
  }

  async checkGraphComment({ postRootId }: { postRootId: string }) {
    return await this.graphCommentModel.findOne({
      postRootId: postRootId,
    });
  }
}
