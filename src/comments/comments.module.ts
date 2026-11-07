import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsController } from './comments.controller.js';
import { CommentsService } from './comments.service.js';
import { Comment, CommentSchema } from './schemas/comment.schema.js';
import { PostsModule } from '../posts/posts.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    PostsModule, // gives us PostsService (PostsModule exports it) to check a post exists
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
