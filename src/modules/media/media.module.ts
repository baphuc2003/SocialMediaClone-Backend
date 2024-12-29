import { Module } from "@nestjs/common";
import { MediaController } from "./media.controller";
import { MediaService } from "./media.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MediaEntity } from "./entities/media.entity";
import { UsersModule } from "../users/users.module";
import { PublicKeyModule } from "../public-key/public-key.module";
import { ConfigModule } from "@nestjs/config";
import { BullModule } from "@nestjs/bullmq";
import { MediaProcessor } from "./media.processor";

@Module({
  imports: [
    TypeOrmModule.forFeature([MediaEntity]),
    UsersModule,
    PublicKeyModule,
    ConfigModule,
    BullModule.registerQueue({
      name: "mediaQueue",
    }),
  ],
  controllers: [MediaController],
  providers: [MediaService, MediaProcessor],
  exports: [MediaService],
})
export class MediaModule {}
