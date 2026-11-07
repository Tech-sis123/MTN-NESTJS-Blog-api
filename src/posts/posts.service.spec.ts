import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { PostsService } from './posts.service.js';
import { Post } from './schemas/post.schema.js';
import { Comment } from '../comments/schemas/comment.schema.js';

// Unit tests don't touch a real database: we hand the service fake models instead.
// Each query method returns { exec } because the service calls .exec() on queries.
const result = (value: unknown) => ({ exec: vi.fn().mockResolvedValue(value) });

describe('PostsService', () => {
  let service: PostsService;
  const postModel = {
    findById: vi.fn(),
    findByIdAndDelete: vi.fn(),
  };
  const commentModel = { deleteMany: vi.fn() };

  beforeEach(async () => {
    vi.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: getModelToken(Post.name), useValue: postModel },
        { provide: getModelToken(Comment.name), useValue: commentModel },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('returns a post that exists', async () => {
    const post = { title: 'Hello' };
    postModel.findById.mockReturnValue(result(post));
    await expect(service.findOne(new Types.ObjectId())).resolves.toBe(post);
  });

  it('throws 404 for a missing post', async () => {
    postModel.findById.mockReturnValue(result(null));
    await expect(service.findOne(new Types.ObjectId())).rejects.toThrow(
      NotFoundException,
    );
  });

  it("deletes a post's comments along with it", async () => {
    const id = new Types.ObjectId();
    postModel.findByIdAndDelete.mockReturnValue(result({ _id: id }));
    commentModel.deleteMany.mockReturnValue(result({ deletedCount: 2 }));
    await service.remove(id);
    expect(commentModel.deleteMany).toHaveBeenCalledWith({ post: id });
  });

  it('does not delete comments when the post is missing', async () => {
    postModel.findByIdAndDelete.mockReturnValue(result(null));
    await expect(service.remove(new Types.ObjectId())).rejects.toThrow(
      NotFoundException,
    );
    expect(commentModel.deleteMany).not.toHaveBeenCalled();
  });
});
