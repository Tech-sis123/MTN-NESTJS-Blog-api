import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { PostCreateDto } from './post-create.dto.js';
import { PostUpdateDto } from './post-update.dto.js';

// These do by hand what ValidationPipe does on every request:
// turn the plain body into a DTO instance, then check its rules.
async function errorsFor(
  cls: typeof PostCreateDto | typeof PostUpdateDto,
  body: object,
) {
  const dto = plainToInstance(cls, body);
  const errors = await validate(dto);
  return errors.flatMap((e) => Object.values(e.constraints ?? {}));
}

const validPost = { title: 'Hello', content: 'First post', author: 'Ada' };

describe('PostCreateDto', () => {
  it('accepts a valid post', async () => {
    expect(await errorsFor(PostCreateDto, validPost)).toEqual([]);
  });

  it('requires title, content and author', async () => {
    const errors = await errorsFor(PostCreateDto, {});
    expect(errors).toContain('title is required');
    expect(errors).toContain('content is required');
    expect(errors).toContain('author is required');
  });

  it('trims whitespace, so a blank title is rejected', async () => {
    expect(
      await errorsFor(PostCreateDto, { ...validPost, title: '   ' }),
    ).toEqual(['title is required']);
    expect(
      plainToInstance(PostCreateDto, { ...validPost, title: '  Hi  ' }).title,
    ).toBe('Hi');
  });

  it('rejects wrong types', async () => {
    const errors = await errorsFor(PostCreateDto, {
      ...validPost,
      title: 123,
      published: 'yes',
    });
    expect(errors).toContain('title must be text');
    expect(errors).toContain('published must be true or false');
  });

  it('validates tags', async () => {
    expect(
      await errorsFor(PostCreateDto, { ...validPost, tags: ['nest', 'ts'] }),
    ).toEqual([]);
    expect(
      await errorsFor(PostCreateDto, { ...validPost, tags: ['ok', 42] }),
    ).toEqual(['every tag must be text']);
    expect(
      await errorsFor(PostCreateDto, {
        ...validPost,
        tags: ['a', 'b', 'c', 'd', 'e', 'f'],
      }),
    ).toEqual(['a post can have at most 5 tags']);
  });
});

describe('PostUpdateDto', () => {
  it('allows sending only some fields', async () => {
    expect(await errorsFor(PostUpdateDto, { title: 'New title' })).toEqual([]);
  });

  it('still applies the create rules to fields that are sent', async () => {
    expect(await errorsFor(PostUpdateDto, { title: '' })).toEqual([
      'title is required',
    ]);
  });
});
