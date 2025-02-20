import { SingleConversationEntity } from "../socket/entities/single-conversation.entity";
import { Repository } from "typeorm";
import { Cache } from "@nestjs/cache-manager";
export declare class ConversationService {
    private readonly singleConversationRepository;
    private cacheManager;
    constructor(singleConversationRepository: Repository<SingleConversationEntity>, cacheManager: Cache);
    getSingleConversation({ senderId, receiverId, }: {
        senderId: string;
        receiverId: string;
    }): Promise<unknown>;
}
