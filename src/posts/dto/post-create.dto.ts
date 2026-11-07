import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Trim } from '../../common/trim.decorator.js';

// A DTO is a class (not an interface) so its decorators still exist at runtime,
// where the global ValidationPipe reads them to check every request body.
export class PostCreateDto {
  @Trim()
  @IsString({ message: 'title must be text' })
  @IsNotEmpty({ message: 'title is required' })
  @MaxLength(200, { message: 'title must be at most 200 characters' })
  title: string;

  @Trim()
  @IsString({ message: 'content must be text' })
  @IsNotEmpty({ message: 'content is required' })
  content: string;

  @Trim()
  @IsString({ message: 'author must be text' })
  @IsNotEmpty({ message: 'author is required' })
  author: string;

  // @IsOptional: if published is missing, skip the rules below it.
  @IsOptional()
  @IsBoolean({ message: 'published must be true or false' })
  published?: boolean;

  @IsOptional()
  @IsArray({ message: 'tags must be an array' })
  @ArrayMaxSize(5, { message: 'a post can have at most 5 tags' })
  @IsString({ each: true, message: 'every tag must be text' })
  tags?: string[];
}
