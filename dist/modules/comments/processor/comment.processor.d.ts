import { Job } from "bull";
import { Model } from "mongoose";
import { GraphCommentDocument } from "../schemas/graph-comment.schema";
export declare class CommentProcessor {
    private graphCommentModel;
    constructor(graphCommentModel: Model<GraphCommentDocument>);
    handleCreatePost(job: Job): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../schemas/graph-comment.schema").GraphComment> & import("../schemas/graph-comment.schema").GraphComment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> & import("mongoose").Document<unknown, {}, import("../schemas/graph-comment.schema").GraphComment> & import("../schemas/graph-comment.schema").GraphComment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
}
