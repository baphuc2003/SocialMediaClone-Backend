import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type GraphCommentDocument = HydratedDocument<GraphComment>;

@Schema()
export class GraphComment {
  @Prop({ required: true })
  userRootId: string;

  @Prop()
  postRootId: string | null;

  @Prop({ type: Object, default: {} })
  graph: Record<string, { id: string; userId: string; edge: string[] }>;

  @Prop()
  created_at: Date;
}

export const GraphCommentSchema = SchemaFactory.createForClass(GraphComment);
