import { UserEntity } from "src/modules/users/entities/users.entity";
export declare class SingleConversationEntity {
    id: string;
    sender: UserEntity;
    senderId: string;
    receiver: UserEntity;
    receiverId: string;
    content: string;
    created_at: Date;
    updated_at: Date;
}
