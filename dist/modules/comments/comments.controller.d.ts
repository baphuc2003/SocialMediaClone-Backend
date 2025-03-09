import { CommentsService } from "./comments.service";
import { Request, Response } from "express";
import { CreateCommentDto } from "./dto/create-comment.dto";
export declare class CommentsController {
    private readonly commentService;
    constructor(commentService: CommentsService);
    createComment(comment: CreateCommentDto, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getComment(postRootId: string, startRootId: string, res: Response): Promise<Response<any, Record<string, any>>>;
}
