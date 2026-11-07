import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { CommentsService } from './comments.service.js';
import { CommentCreateDto } from './dto/comment-create.dto.js';
import { CommentUpdateDto } from './dto/comment-update.dto.js';

// Nested routes: a comment always belongs to a post, so its URL starts with that post.
@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(
    @Param('postId', ParseObjectIdPipe) postId: Types.ObjectId,
    @Body() commentCreateDto: CommentCreateDto,
  ) {
    return this.commentsService.create(postId, commentCreateDto);
  }

  @Get()
  findAll(@Param('postId', ParseObjectIdPipe) postId: Types.ObjectId) {
    return this.commentsService.findAllForPost(postId);
  }

  @Patch(':id')
  update(
    @Param('postId', ParseObjectIdPipe) postId: Types.ObjectId,
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() commentUpdateDto: CommentUpdateDto,
  ) {
    return this.commentsService.update(postId, id, commentUpdateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('postId', ParseObjectIdPipe) postId: Types.ObjectId,
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ) {
    return this.commentsService.remove(postId, id);
  }
}
