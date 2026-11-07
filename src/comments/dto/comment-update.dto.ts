import { PartialType } from '@nestjs/mapped-types';
import { CommentCreateDto } from './comment-create.dto.js';

export class CommentUpdateDto extends PartialType(CommentCreateDto) {}
