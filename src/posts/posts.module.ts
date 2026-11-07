import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsService } from './posts.service.js';
import { PostsController } from './posts.controller.js';
import { Post, PostSchema } from './schemas/post.schema.js';
import { Comment, CommentSchema } from '../comments/schemas/comment.schema.js';

// A module groups everything belonging to one feature.
// AppModule imports this module, which is how the /posts routes join the app.
@Module({
  // forFeature registers the models this module's services can inject with @InjectModel.
  // Comment is here too so deleting a post can also delete its comments.
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  controllers: [PostsController], // classes that handle HTTP routes
  providers: [PostsService], // classes Nest can create and inject (dependency injection)
  exports: [PostsService], // lets other modules (CommentsModule) inject PostsService
})
export class PostsModule {}
