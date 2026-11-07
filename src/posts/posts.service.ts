import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PostCreateDto } from './dto/post-create.dto.js';
import { PostUpdateDto } from './dto/post-update.dto.js';
import { PostQueryDto } from './dto/post-query.dto.js';
import { Post, PostDocument } from './schemas/post.schema.js';
import { Comment } from '../comments/schemas/comment.schema.js';

// The service holds the business logic and data. It knows nothing about HTTP,
// so anything else in the app can reuse it. @Injectable() lets Nest inject it.
@Injectable()
export class PostsService {
  // @InjectModel asks Nest for the Mongoose model registered in PostsModule.
  // Every method is async: database calls are I/O, so we await the answer.
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
  ) {}

  // createdAt/updatedAt, published and tags are filled in by the schema (timestamps + defaults).
  create(postCreateDto: PostCreateDto): Promise<PostDocument> {
    return this.postModel.create(postCreateDto);
  }

  // Newest first, one page at a time. Without `published` in the query, drafts are included.
  async findAll({ published, page, limit }: PostQueryDto) {
    const filter = published === undefined ? {} : { published };
    const [data, total] = await Promise.all([
      this.postModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.postModel.countDocuments(filter).exec(),
    ]);
    return { data, total, page, limit };
  }

  async findOne(id: Types.ObjectId): Promise<PostDocument> {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException(`Post ${id} not found`);
    }
    return post;
  }

  async update(
    id: Types.ObjectId,
    postUpdateDto: PostUpdateDto,
  ): Promise<PostDocument> {
    // returnDocument: 'after' returns the updated post, not the old one.
    // runValidators: true applies the schema rules to updates too (they only run on create by default).
    const post = await this.postModel
      .findByIdAndUpdate(id, postUpdateDto, {
        returnDocument: 'after',
        runValidators: true,
      })
      .exec();
    if (!post) {
      throw new NotFoundException(`Post ${id} not found`);
    }
    return post;
  }

  async remove(id: Types.ObjectId): Promise<void> {
    const post = await this.postModel.findByIdAndDelete(id).exec();
    if (!post) {
      throw new NotFoundException(`Post ${id} not found`);
    }
    // Delete the post's comments too, so none are left pointing at a missing post.
    await this.commentModel.deleteMany({ post: id }).exec();
  }
}
