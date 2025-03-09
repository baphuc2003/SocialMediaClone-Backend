import { HydratedDocument } from "mongoose";
export type CommentDocument = HydratedDocument<Comment>;
export declare class Comment {
    userId: string;
    parentId: string | null;
    content: string;
    postRootId: string;
    replyCount: number;
    created_at: Date;
}
export declare const CommentSchema: import("mongoose").Schema<Comment, import("mongoose").Model<Comment, any, any, any, import("mongoose").Document<unknown, any, Comment> & Comment & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Comment, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Comment>> & import("mongoose").FlatRecord<Comment> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
