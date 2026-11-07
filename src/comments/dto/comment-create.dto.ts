import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Trim } from '../../common/trim.decorator.js';

// No `post` field: the post id comes from the URL (/posts/:postId/comments), not the body.
export class CommentCreateDto {
  @Trim()
  @IsString({ message: 'author must be text' })
  @IsNotEmpty({ message: 'author is required' })
  author: string;

  @Trim()
  @IsString({ message: 'content must be text' })
  @IsNotEmpty({ message: 'content is required' })
  @MaxLength(1000, { message: 'content must be at most 1000 characters' })
  content: string;
}
