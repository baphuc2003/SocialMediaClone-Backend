import { forwardRef, Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entities/users.entity";
import { MailModule } from "../mail/mail.module";
import { PublicKeyModule } from "../public-key/public-key.module";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { BullModule } from "@nestjs/bullmq";
import { FollowEntity } from "./entities/follow.entity";
import { MakeFriendEntity } from "./entities/make-friend.entity";
import { SocketModule } from "../socket/socket.module";
import { NotificationModule } from "../notification/notification.module";
import { RabbitMQModule } from "../rabbitMq/rabbitmq.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, FollowEntity, MakeFriendEntity]),
    BullModule.registerQueue({
      name: "userQueue",
      defaultJobOptions: {
        attempts: 3,
        removeOnComplete: true,
        removeOnFail: false,
      },
    }),
    MailModule,
    PublicKeyModule,
    forwardRef(() => SocketModule),
    forwardRef(() => NotificationModule),
    RabbitMQModule,
  ],
  providers: [UsersService],
  exports: [UsersService, BullModule, TypeOrmModule],
})
export class UsersModule {}
