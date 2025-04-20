import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationEntity } from "./entities/notification.entity";
import { NotificationController } from "./notification.controller";
import { NotificationService } from "./notification.service";
import { UsersModule } from "../users/users.module";
import { PublicKeyModule } from "../public-key/public-key.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationEntity]),
    forwardRef(() => UsersModule),
    PublicKeyModule,
  ],
  providers: [NotificationService],
  exports: [TypeOrmModule],
  controllers: [NotificationController],
})
export class NotificationModule {}
