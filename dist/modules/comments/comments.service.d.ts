import { Comment, CommentDocument } from "./schemas/comment.schema";
import { Model } from "mongoose";
import { GraphComment, GraphCommentDocument } from "./schemas/graph-comment.schema";
import { Types } from "mongoose";
import { Queue } from "bull";
import { UserEntity } from "../users/entities/users.entity";
import { Repository } from "typeorm";
export declare class CommentsService {
    private commentModel;
    private graphCommentModel;
    private readonly usersRepository;
    private commentQueue;
    constructor(commentModel: Model<CommentDocument>, graphCommentModel: Model<GraphCommentDocument>, usersRepository: Repository<UserEntity>, commentQueue: Queue);
    createComment({ userId, content, postRootId, userRootId, parentId, }: {
        userId: string;
        content: string;
        postRootId: string;
        userRootId: string;
        parentId: string | null;
    }): Promise<Comment>;
    getComment({ postRootId, startRootId, }: {
        postRootId: string;
        startRootId: string;
    }): Promise<{
        user: UserEntity;
        replyCount: number;
        _id: Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        id?: any;
        isNew: boolean;
        schema: import("mongoose").Schema;
        userId: string;
        parentId: string | null;
        content: string;
        postRootId: string;
        created_at: Date;
        __v: number;
    }[]>;
    checkGraphComment({ postRootId }: {
        postRootId: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, GraphComment> & GraphComment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }> & import("mongoose").Document<unknown, {}, GraphComment> & GraphComment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
}
