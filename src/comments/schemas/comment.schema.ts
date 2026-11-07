import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

// Comments live in their own "comments" collection and point to their post by _id
// (a reference), instead of being nested inside the post document.
@Schema({ timestamps: true, versionKey: false })
export class Comment {
  // ref: 'Post' tells Mongoose which model this id belongs to.
  // index: true makes "find all comments for this post" fast.
  @Prop({ type: Types.ObjectId, ref: 'Post', required: true, index: true })
  post: Types.ObjectId;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  content: string;

  createdAt: Date;
  updatedAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
