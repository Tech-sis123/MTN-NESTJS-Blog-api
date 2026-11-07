import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { PostQueryDto } from './post-query.dto.js';

async function parse(query: object) {
  const dto = plainToInstance(PostQueryDto, query);
  const errors = await validate(dto);
  return {
    dto,
    errors: errors.flatMap((e) => Object.values(e.constraints ?? {})),
  };
}

describe('PostQueryDto', () => {
  it('defaults to page 1, 10 per page, no published filter', async () => {
    const { dto, errors } = await parse({});
    expect(errors).toEqual([]);
    expect(dto).toMatchObject({ page: 1, limit: 10 });
    expect(dto.published).toBeUndefined();
  });

  it('converts query-string text into numbers and booleans', async () => {
    const { dto, errors } = await parse({
      published: 'false',
      page: '2',
      limit: '20',
    });
    expect(errors).toEqual([]);
    expect(dto).toMatchObject({ published: false, page: 2, limit: 20 });
  });

  it('rejects bad values', async () => {
    const { errors } = await parse({
      published: 'maybe',
      page: '0',
      limit: '500',
    });
    expect(errors).toEqual(
      expect.arrayContaining([
        'published must be true or false',
        'page must be at least 1',
        'limit must be at most 100',
      ]),
    );
  });
});
