import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
  @Prop({ required: true })
  userId: string;

  @Prop()
  parentId: string | null;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  postRootId: string;

  @Prop()
  replyCount: number;

  @Prop()
  created_at: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
