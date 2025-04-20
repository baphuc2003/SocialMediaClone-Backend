import { forwardRef, Module } from "@nestjs/common";
import { NotificationGateway } from "./gateways/notification.gateway";
import { SocketController } from "./socket.controller";
import { UsersModule } from "../users/users.module";
import { PublicKeyModule } from "../public-key/public-key.module";
import { SingleConversationEntity } from "./entities/single-conversation.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SocketService } from "./socket.service";
import { CacheModule } from "@nestjs/cache-manager";

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PublicKeyModule,
    TypeOrmModule.forFeature([SingleConversationEntity]),
    CacheModule.register(),
  ],

  providers: [NotificationGateway, SocketService],
  controllers: [SocketController],
  exports: [NotificationGateway],
})
export class SocketModule {}
