import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { isUUID } from "class-validator";
import { SingleConversationEntity } from "../socket/entities/single-conversation.entity";
import { Repository } from "typeorm";
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(SingleConversationEntity)
    private readonly singleConversationRepository: Repository<SingleConversationEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
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

    const isExistedListChat = await this.cacheManager.get(
      `chat:${senderId}:${receiverId}`
    );

    if (isExistedListChat) {
      return isExistedListChat;
    }

    const listChat = await this.singleConversationRepository.find({
      where: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
      order: { created_at: "ASC" },
    });

    await this.cacheManager.set(
      `chat:${senderId}:${receiverId}`,
      listChat,
      180
    );
    return listChat;
  }
}
