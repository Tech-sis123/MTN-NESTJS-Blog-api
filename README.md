# Blog API

A REST API for blog posts and their comments, built with [NestJS](https://nestjs.com), TypeScript and MongoDB (Mongoose).

- Create, read, update and delete posts; add, list, edit and delete comments on a post
- Request validation with `class-validator` (bad input gets a `400` with a clear message)
- Filter posts by `published` and paginate the list
- Interactive API docs (Swagger UI) at `/docs`
- Unit tests plus an end-to-end test that runs on an in-memory MongoDB

## Setup

**Requirements:** Node.js 22 or newer, and a MongoDB server running locally (or a connection string to a hosted one, e.g. MongoDB Atlas).

```bash
npm install
cp .env.example .env     # on Windows PowerShell: Copy-Item .env.example .env
npm run start:dev
```

Edit `.env` if your MongoDB is not at the default address:

| Variable      | Default                                | Meaning                  |
| ------------- | -------------------------------------- | ------------------------ |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/blog-api`   | MongoDB connection string |
| `PORT`        | `3000`                                 | Port the API listens on  |

The API is then at `http://localhost:3000` and the Swagger UI at `http://localhost:3000/docs`.

## Endpoints

| Method | Path                         | Description                                    | Success |
| ------ | ---------------------------- | ---------------------------------------------- | ------- |
| POST   | `/posts`                     | Create a post                                  | 201     |
| GET    | `/posts`                     | List posts (newest first, paginated, filterable) | 200   |
| GET    | `/posts/:id`                 | Get one post                                   | 200     |
| PATCH  | `/posts/:id`                 | Update some fields of a post                   | 200     |
| DELETE | `/posts/:id`                 | Delete a post and all its comments             | 204     |
| POST   | `/posts/:postId/comments`    | Add a comment to a post                        | 201     |
| GET    | `/posts/:postId/comments`    | List a post's comments (oldest first)          | 200     |
| PATCH  | `/posts/:postId/comments/:id`| Update a comment                               | 200     |
| DELETE | `/posts/:postId/comments/:id`| Delete a comment                               | 204     |

Errors: `400` for invalid input or a malformed id, `404` when the post or comment does not exist.

**Post fields:** `title` (required, max 200 chars), `content` (required, max 10 000), `author` (required), `published` (boolean, default `false`), `tags` (up to 5 non-empty strings, each max 30 chars).
**Comment fields:** `author` (required), `content` (required, max 1 000).

**`GET /posts` query parameters:**

| Parameter   | Default | Meaning                                                  |
| ----------- | ------- | -------------------------------------------------------- |
| `published` | (none)  | `true` or `false` to filter; leave out to include drafts |
| `page`      | `1`     | Page number, starting at 1                               |
| `limit`     | `10`    | Posts per page, 1 to 100                                 |

## Examples

Create a post:

```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello NestJS","content":"My first post","author":"Ada","published":true,"tags":["nestjs"]}'
```

```json
{
  "_id": "6650f1c2a1b2c3d4e5f60718",
  "title": "Hello NestJS",
  "content": "My first post",
  "author": "Ada",
  "published": true,
  "tags": ["nestjs"],
  "createdAt": "2026-11-07T15:00:00.000Z",
  "updatedAt": "2026-11-07T15:00:00.000Z"
}
```

Comment on it, using the post's `_id`:

```bash
curl -X POST http://localhost:3000/posts/6650f1c2a1b2c3d4e5f60718/comments \
  -H "Content-Type: application/json" \
  -d '{"author":"Bob","content":"Nice post!"}'
```

List the first page of published posts:

```bash
curl "http://localhost:3000/posts?published=true&page=1&limit=10"
```

```json
{ "data": [ { "_id": "...", "title": "Hello NestJS" } ], "total": 1, "page": 1, "limit": 10 }
```

## Scripts

| Command             | What it does                                             |
| ------------------- | -------------------------------------------------------- |
| `npm run start:dev` | Start with auto-reload                                   |
| `npm run build`     | Compile to `dist/`                                       |
| `npm run start:prod`| Run the compiled app                                     |
| `npm test`          | Unit tests                                               |
| `npm run test:e2e`  | End-to-end test (downloads a MongoDB binary on first run, then needs no running database) |
| `npm run lint`      | Lint with oxlint                                         |

## Project layout

```
src/
  main.ts          starts the server, sets up Swagger
  app.setup.ts     validation settings shared by the server and the tests
  app.module.ts    root module: config + database connection
  posts/           controller, service, schema and DTOs for posts
  comments/        same, for comments (stored in their own collection)
test/              end-to-end test
```
