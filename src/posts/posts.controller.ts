import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiExceptionResponse } from 'nestjs-swagger-api-exception-response';

import { User } from '@@decorators';
import { ParsePositiveIntPipe } from '@@pipes';

import { CreatePostRequestDto, UpdatePostRequestDto } from './dto/posts.request.dto';
import {
  CreatePostResponseDto,
  FindDetailedPostResponseDto,
  FindPostsResponseDto,
  LikePostResponseDto,
} from './dto/posts.response.dto';
import { PostsService } from './posts.service';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: 'find posts' })
  @Get()
  async findPosts(): Promise<FindPostsResponseDto> {
    return await this.postsService.findPosts();
  }

  @ApiOperation({ summary: 'create post' })
  @ApiResponse({ type: CreatePostResponseDto, status: HttpStatus.CREATED, description: 'create post success' })
  @ApiBearerAuth('accessToken')
  @UseGuards(AuthGuard('access'))
  @Post()
  async createPost(
    @User('id') userId: number,
    @Body() createPostRequestDto: CreatePostRequestDto,
  ): Promise<CreatePostResponseDto> {
    return await this.postsService.createPost(userId, createPostRequestDto);
  }

  @ApiOperation({ summary: 'find detailed post' })
  @ApiResponse({ type: FindDetailedPostResponseDto, status: HttpStatus.OK, description: 'post found success' })
  @ApiExceptionResponse(HttpStatus.NOT_FOUND, [{ message: 'post not found', errorCode: 'E0009' }])
  @Get(':postId')
  async findDetailedPost(@Param('postId', ParsePositiveIntPipe) postId: number): Promise<FindDetailedPostResponseDto> {
    return await this.postsService.findDetailedPost(postId);
  }

  @ApiOperation({ summary: 'update post' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'update post success' })
  @ApiExceptionResponse(HttpStatus.FORBIDDEN, [{ message: 'forbidden', errorCode: 'E0008' }])
  @ApiExceptionResponse(HttpStatus.NOT_FOUND, [{ message: 'post not found', errorCode: 'E0009' }])
  @ApiBearerAuth('accessToken')
  @UseGuards(AuthGuard('access'))
  @Put(':postId')
  async updatePost(
    @User('id') userId: number,
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @Body() updatePostRequestDto: UpdatePostRequestDto,
  ): Promise<void> {
    await this.postsService.updatePost(userId, postId, updatePostRequestDto);
  }

  @ApiOperation({ summary: 'delete post' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'delete post success' })
  @ApiExceptionResponse(HttpStatus.FORBIDDEN, [{ message: 'forbidden', errorCode: 'E0008' }])
  @ApiExceptionResponse(HttpStatus.NOT_FOUND, [{ message: 'post not found', errorCode: 'E0009' }])
  @ApiBearerAuth('accessToken')
  @UseGuards(AuthGuard('access'))
  @Delete(':postId')
  async deletePost(@User('id') userId: number, @Param('postId', ParsePositiveIntPipe) postId: number): Promise<void> {
    await this.postsService.deletePost(userId, postId);
  }

  @ApiOperation({ summary: 'like post' })
  @ApiResponse({ type: LikePostResponseDto, status: HttpStatus.OK, description: 'like post success' })
  @ApiExceptionResponse(HttpStatus.NOT_FOUND, [{ message: 'post not found', errorCode: 'E0009' }])
  @ApiBearerAuth('accessToken')
  @UseGuards(AuthGuard('access'))
  @Patch(':postId')
  async likePost(
    @User('id') userId: number,
    @Param('postId', ParsePositiveIntPipe) postId: number,
  ): Promise<LikePostResponseDto> {
    return await this.postsService.likePost(userId, postId);
  }
}
