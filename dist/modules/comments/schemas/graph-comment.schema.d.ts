import { HydratedDocument } from "mongoose";
export type GraphCommentDocument = HydratedDocument<GraphComment>;
export declare class GraphComment {
    userRootId: string;
    postRootId: string | null;
    graph: Record<string, {
        id: string;
        userId: string;
        edge: string[];
    }>;
    created_at: Date;
}
export declare const GraphCommentSchema: import("mongoose").Schema<GraphComment, import("mongoose").Model<GraphComment, any, any, any, import("mongoose").Document<unknown, any, GraphComment> & GraphComment & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, GraphComment, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<GraphComment>> & import("mongoose").FlatRecord<GraphComment> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
