import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { isUUID } from "class-validator";
import { SingleConversationEntity } from "./entities/single-conversation.entity";
import { Repository } from "typeorm";

@Injectable()
export class SocketService {
  constructor(
    @InjectRepository(SingleConversationEntity)
    private readonly singleConversationRepository: Repository<SingleConversationEntity>
  ) {}

  async getSingleConversation({
    senderId,
    receiverId,
  }: {
    senderId: string;
    receiverId: string;
  }) {
    if (!senderId?.trim() || !receiverId?.trim()) {
      throw new BadRequestException("SenderId or ReceiverId cannot be empty!");
    }

    if (!isUUID(senderId) || !isUUID(receiverId)) {
      throw new BadRequestException("Invalid SenderId or ReceiverId format!");
    }

    if (senderId === receiverId) {
      throw new BadRequestException(
        "SenderId and ReceiverId cannot be the same!"
      );
    }

    const listChat = await this.singleConversationRepository.find({
      where: {
        senderId: senderId,
        receiverId: receiverId,
      },
    });

    return listChat;
  }
}
