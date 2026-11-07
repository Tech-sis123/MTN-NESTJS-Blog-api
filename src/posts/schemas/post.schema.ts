import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// A post as it comes back from the database: our fields plus _id and Mongoose's helper methods.
export type PostDocument = HydratedDocument<Post>;

// The schema describes what a document in the "posts" collection looks like.
// timestamps: true makes Mongoose set createdAt on insert and updatedAt on every change.
// versionKey: false drops Mongoose's internal __v field from documents.
@Schema({ timestamps: true, versionKey: false })
export class Post {
  @Prop({ required: true, trim: true, maxlength: 200 })
  title: string;

  @Prop({ required: true, maxlength: 10000 })
  content: string;

  @Prop({ required: true })
  author: string;

  @Prop({ default: false })
  published: boolean;

  @Prop({ type: [String], default: [] })
  tags: string[];

  // Filled in by timestamps: true. Declared so TypeScript knows they exist.
  createdAt: Date;
  updatedAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
