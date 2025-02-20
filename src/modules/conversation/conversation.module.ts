import { Module } from "@nestjs/common";
import { ConversationController } from "./conversation.controller";
import { ConversationService } from "./conversation.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SingleConversationEntity } from "../socket/entities/single-conversation.entity";
import { PublicKeyModule } from "../public-key/public-key.module";
import { UsersModule } from "../users/users.module";
import { CacheModule } from "@nestjs/cache-manager";

@Module({
  imports: [
    TypeOrmModule.forFeature([SingleConversationEntity]),
    PublicKeyModule,
    UsersModule,
    CacheModule.register(),
  ],
  controllers: [ConversationController],
  providers: [ConversationService],
})
export class ConversationModule {}
