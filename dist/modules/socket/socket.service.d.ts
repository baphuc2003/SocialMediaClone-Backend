import { SingleConversationEntity } from "./entities/single-conversation.entity";
import { Repository } from "typeorm";
export declare class SocketService {
    private readonly singleConversationRepository;
    constructor(singleConversationRepository: Repository<SingleConversationEntity>);
}
