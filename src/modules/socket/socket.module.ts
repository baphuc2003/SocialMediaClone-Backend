import { Module } from "@nestjs/common";
import { NotificationGateway } from "./gateways/notification.gateway";
import { SocketController } from "./socket.controller";
import { UsersModule } from "../users/users.module";
import { PublicKeyModule } from "../public-key/public-key.module";
import { SingleConversationEntity } from "./entities/single-conversation.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SocketService } from './socket.service';

@Module({
  imports: [
    UsersModule,
    PublicKeyModule,
    TypeOrmModule.forFeature([SingleConversationEntity]),
  ],

  providers: [NotificationGateway, SocketService],
  controllers: [SocketController],
})
export class SocketModule {}
