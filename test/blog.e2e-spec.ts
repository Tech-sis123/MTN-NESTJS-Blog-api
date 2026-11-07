import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { PostsModule } from '../src/posts/posts.module.js';
import { CommentsModule } from '../src/comments/comments.module.js';
import { configureApp } from '../src/app.setup.js';

// Runs the real app against a throwaway in-memory MongoDB, so no database needs to be running.
describe('Posts and comments (e2e)', () => {
  let mongo: MongoMemoryServer;
  let app: INestApplication;
  const http = () => request(app.getHttpServer());

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRoot(mongo.getUri()),
        PostsModule,
        CommentsModule,
      ],
    }).compile();
    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await mongo.stop();
  });

  it('creates a post, comments on it, and deletes both', async () => {
    const created = await http()
      .post('/posts')
      .send({ title: '  My first post ', content: 'Hello', author: 'Ada' })
      .expect(201);
    expect(created.body).toMatchObject({
      title: 'My first post',
      published: false,
      tags: [],
    });
    const postId = created.body._id;

    const comment = await http()
      .post(`/posts/${postId}/comments`)
      .send({ author: 'Bob', content: 'Nice one' })
      .expect(201);
    expect(comment.body).toMatchObject({ post: postId, content: 'Nice one' });

    const list = await http().get(`/posts/${postId}/comments`).expect(200);
    expect(list.body).toHaveLength(1);

    await http().delete(`/posts/${postId}`).expect(204);
    await http().get(`/posts/${postId}`).expect(404);
    // The comments went with the post.
    await http().get(`/posts/${postId}/comments`).expect(404);
  });

  it('rejects invalid input with 400', async () => {
    await http().post('/posts').send({ title: 'No content' }).expect(400);
    await http()
      .post('/posts')
      .send({ title: 'T', content: 'C', author: 'A', tags: [''] })
      .expect(400);
    await http()
      .post('/posts')
      .send({ title: 'T', content: 'C', author: 'A', extra: 'nope' })
      .expect(400);
    await http().get('/posts/not-an-id').expect(400);
  });

  it('filters by published and paginates', async () => {
    for (let i = 1; i <= 3; i++) {
      await http()
        .post('/posts')
        .send({
          title: `Page ${i}`,
          content: 'C',
          author: 'A',
          published: true,
        })
        .expect(201);
    }

    const published = await http()
      .get('/posts?published=true&limit=2')
      .expect(200);
    expect(published.body.data).toHaveLength(2);
    expect(published.body.total).toBe(3);
    expect(
      published.body.data.every((p: { published: boolean }) => p.published),
    ).toBe(true);

    const second = await http()
      .get('/posts?published=true&limit=2&page=2')
      .expect(200);
    expect(second.body.data).toHaveLength(1);

    await http().get('/posts?limit=1000').expect(400);
  });
});
