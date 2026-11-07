import { PartialType } from '@nestjs/mapped-types';
import { PostCreateDto } from './post-create.dto.js';

// PartialType copies every rule from PostCreateDto and makes each field optional,
// so PATCH can send just the fields it wants to change.
export class PostUpdateDto extends PartialType(PostCreateDto) {}
