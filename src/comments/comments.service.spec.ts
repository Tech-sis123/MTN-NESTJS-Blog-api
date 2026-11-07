import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { CommentsService } from './comments.service.js';
import { Comment } from './schemas/comment.schema.js';
import { PostsService } from '../posts/posts.service.js';

describe('CommentsService', () => {
  let service: CommentsService;
  const commentModel = { create: vi.fn() };
  const postsService = { findOne: vi.fn() };

  beforeEach(async () => {
    vi.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        { provide: getModelToken(Comment.name), useValue: commentModel },
        { provide: PostsService, useValue: postsService },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
  });

  it('saves a comment linked to its post', async () => {
    const postId = new Types.ObjectId();
    postsService.findOne.mockResolvedValue({ _id: postId });
    await service.create(postId, { author: 'Ada', content: 'Nice post' });
    expect(commentModel.create).toHaveBeenCalledWith({
      author: 'Ada',
      content: 'Nice post',
      post: postId,
    });
  });

  it('refuses to comment on a missing post', async () => {
    postsService.findOne.mockRejectedValue(new NotFoundException());
    await expect(
      service.create(new Types.ObjectId(), { author: 'Ada', content: 'Hi' }),
    ).rejects.toThrow(NotFoundException);
    expect(commentModel.create).not.toHaveBeenCalled();
  });
});
