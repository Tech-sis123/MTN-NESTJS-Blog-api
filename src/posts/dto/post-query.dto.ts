import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';

// Query-string values always arrive as text, so each field is converted before it is checked.
export class PostQueryDto {
  // Type(() => Number) would turn "false" into true for booleans, so we compare the text ourselves.
  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  @IsOptional()
  @IsBoolean({ message: 'published must be true or false' })
  published?: boolean;

  @Type(() => Number)
  @IsOptional()
  @IsInt({ message: 'page must be a whole number' })
  @Min(1, { message: 'page must be at least 1' })
  page: number = 1;

  @Type(() => Number)
  @IsOptional()
  @IsInt({ message: 'limit must be a whole number' })
  @Min(1, { message: 'limit must be at least 1' })
  @Max(100, { message: 'limit must be at most 100' })
  limit: number = 10;
}
