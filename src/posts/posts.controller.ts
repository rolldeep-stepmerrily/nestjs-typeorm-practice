import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { User } from '@@decorators';
import { ParsePositiveIntPipe } from '@@pipes';

import { CreatePostRequestDto } from './dto/posts.request.dto';
import { CreatePostResponseDto, FindDetailedPostResponseDto, FindPostsResponseDto } from './dto/posts.response.dto';
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
  @Get(':postId')
  async findDetailedPost(@Param('postId', ParsePositiveIntPipe) postId: number): Promise<FindDetailedPostResponseDto> {
    return await this.postsService.findDetailedPost(postId);
  }
}
