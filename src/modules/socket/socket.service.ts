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
}
