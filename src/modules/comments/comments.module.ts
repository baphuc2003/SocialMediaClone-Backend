import { Module } from "@nestjs/common";
import { CommentsController } from "./comments.controller";
import { CommentsService } from "./comments.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Comment, CommentSchema } from "./schemas/comment.schema";
import { UsersModule } from "../users/users.module";
import { PublicKeyModule } from "../public-key/public-key.module";
import {
  GraphComment,
  GraphCommentSchema,
} from "./schemas/graph-comment.schema";
import { BullModule } from "@nestjs/bull";
import { CommentProcessor } from "./processor/comment.processor";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../users/entities/users.entity";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: "Graph_Comment", schema: GraphCommentSchema },
    ]),
    TypeOrmModule.forFeature([UserEntity]),
    BullModule.registerQueue({
      name: "commentQueue",
    }),
    UsersModule,
    PublicKeyModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentProcessor],
  exports: [BullModule],
})
export class CommentsModule {}
