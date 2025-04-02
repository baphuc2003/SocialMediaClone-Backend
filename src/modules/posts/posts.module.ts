import { Module } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { PostsController } from "./posts.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostEntity } from "./entities/post.entity";
import { HashtagEntity } from "./entities/hashtag.entity";
import { UsersModule } from "../users/users.module";
import { PublicKeyModule } from "../public-key/public-key.module";
import { BullModule } from "@nestjs/bull";
import { PostProcessor } from "./processor/post.processor";
import { MediaModule } from "../media/media.module";
import { LikeEntity } from "./entities/like.entity";
import { CommentsModule } from "../comments/comments.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity, HashtagEntity, LikeEntity]),
    UsersModule,
    PublicKeyModule,
    MediaModule,
    CommentsModule,
    BullModule.registerQueue({
      name: "postQueue",
    }),
  ],
  controllers: [PostsController],
  providers: [PostsService, PostProcessor],
  exports: [TypeOrmModule, PostsService, BullModule],
})
export class PostsModule {}
