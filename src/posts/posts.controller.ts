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
  Query,
} from '@nestjs/common';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { PostsService } from './posts.service.js';
import { PostCreateDto } from './dto/post-create.dto.js';
import { PostUpdateDto } from './dto/post-update.dto.js';
import { PostQueryDto } from './dto/post-query.dto.js';

// The controller's only job is HTTP: read the URL, params and body, call the service,
// and return the result (Nest turns it into JSON). All routes here start with /posts.
@Controller('posts')
export class PostsController {
  // Nest sees this constructor needs a PostsService and injects the single shared instance.
  constructor(private readonly postsService: PostsService) {}

  // The service returns Promises; Nest waits for them before sending the response.
  @Post()
  create(@Body() postCreateDto: PostCreateDto) {
    return this.postsService.create(postCreateDto);
  }

  @Get()
  findAll(@Query() query: PostQueryDto) {
    return this.postsService.findAll(query);
  }

  // ParseObjectIdPipe checks the id looks like a MongoDB ObjectId (24 hex characters)
  // and replies 400 Bad Request if not, before the database is ever asked.
  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() postUpdateDto: PostUpdateDto,
  ) {
    return this.postsService.update(id, postUpdateDto);
  }

  // Returning the Promise matters: without it, a 404 from the service would be lost.
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.postsService.remove(id);
  }
}
