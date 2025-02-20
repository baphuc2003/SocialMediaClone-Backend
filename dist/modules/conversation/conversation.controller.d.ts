import { Request, Response } from "express";
import { ConversationService } from "./conversation.service";
export declare class ConversationController {
    private conversationService;
    constructor(conversationService: ConversationService);
    getSingleConversation(req: Request, receiverId: string, res: Response): Promise<Response<any, Record<string, any>>>;
}
