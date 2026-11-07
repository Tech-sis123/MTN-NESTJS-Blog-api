import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PostsService } from '../posts/posts.service.js';
import { CommentCreateDto } from './dto/comment-create.dto.js';
import { CommentUpdateDto } from './dto/comment-update.dto.js';
import { Comment, CommentDocument } from './schemas/comment.schema.js';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    private readonly postsService: PostsService,
  ) {}

  async create(
    postId: Types.ObjectId,
    commentCreateDto: CommentCreateDto,
  ): Promise<CommentDocument> {
    await this.postsService.findOne(postId); // throws 404 if the post doesn't exist
    return this.commentModel.create({ ...commentCreateDto, post: postId });
  }

  // Oldest first, like a conversation.
  async findAllForPost(postId: Types.ObjectId): Promise<CommentDocument[]> {
    await this.postsService.findOne(postId);
    return this.commentModel
      .find({ post: postId })
      .sort({ createdAt: 1 })
      .exec();
  }

  // Matching on both _id and post means a comment can only be changed through its own post's URL.
  async update(
    postId: Types.ObjectId,
    id: Types.ObjectId,
    commentUpdateDto: CommentUpdateDto,
  ): Promise<CommentDocument> {
    const comment = await this.commentModel
      .findOneAndUpdate({ _id: id, post: postId }, commentUpdateDto, {
        returnDocument: 'after',
        runValidators: true,
      })
      .exec();
    if (!comment) {
      throw new NotFoundException(`Comment ${id} not found on post ${postId}`);
    }
    return comment;
  }

  async remove(postId: Types.ObjectId, id: Types.ObjectId): Promise<void> {
    const comment = await this.commentModel
      .findOneAndDelete({ _id: id, post: postId })
      .exec();
    if (!comment) {
      throw new NotFoundException(`Comment ${id} not found on post ${postId}`);
    }
  }
}
