import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EntityManager, IsNull, Repository } from 'typeorm';

import { CustomHttpException, GLOBAL_ERRORS } from '@@exceptions';

import { User } from 'src/users/entities';

import { CreatePostRequestDto, UpdatePostRequestDto } from './dto/posts.request.dto';
import {
  CreatePostResponseDto,
  FindDetailedPostResponseDto,
  FindPostsResponseDto,
  LikePostResponseDto,
} from './dto/posts.response.dto';
import { Post } from './entities';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    private readonly entityManager: EntityManager,
  ) {}

  async findPosts(): Promise<FindPostsResponseDto> {
    const posts = await this.postsRepository.find({
      where: { deletedAt: IsNull() },
      relations: ['user', 'likes'],
      select: {
        id: true,
        title: true,
        likes: { id: true },
        views: true,
        createdAt: true,
        user: { id: true, username: true },
      },
    });

    const postsWithLikesCount = posts.map((post) => ({
      id: post.id,
      title: post.title,
      views: post.views,
      createdAt: post.createdAt,
      user: post.user,
      likesCount: post.likes.length,
    }));

    return { posts: postsWithLikesCount };
  }

  async createPost(userId: number, createPostRequestDto: CreatePostRequestDto): Promise<CreatePostResponseDto> {
    const createdPost = await this.entityManager.transaction(async (entityManager) => {
      const user = await entityManager.findOneOrFail(User, { where: { id: userId } });

      const newPost = new Post({ ...createPostRequestDto, user });

      return await entityManager.save(newPost);
    });

    return { id: createdPost.id };
  }

  async findDetailedPost(postId: number): Promise<FindDetailedPostResponseDto> {
    const foundPost = await this.postsRepository.findOne({
      where: { id: postId, deletedAt: IsNull() },
      relations: ['user', 'likes'],
      select: {
        id: true,
        title: true,
        content: true,
        likes: { id: true },
        views: true,
        createdAt: true,
        user: { id: true, username: true },
      },
    });

    if (!foundPost) {
      throw new CustomHttpException(GLOBAL_ERRORS.POST_NOT_FOUND);
    }

    return {
      id: foundPost.id,
      title: foundPost.title,
      content: foundPost.content,
      views: foundPost.views,
      createdAt: foundPost.createdAt,
      user: foundPost.user,
      likesCount: foundPost.likes.length,
    };
  }

  async updatePost(userId: number, postId: number, updatePostRequestDto: UpdatePostRequestDto): Promise<void> {
    const post = await this.postsRepository.findOne({ where: { id: postId, deletedAt: IsNull() } });

    if (!post) {
      throw new CustomHttpException(GLOBAL_ERRORS.POST_NOT_FOUND);
    }

    if (post.user.id !== userId) {
      throw new CustomHttpException(GLOBAL_ERRORS.FORBIDDEN);
    }

    await this.postsRepository.update(postId, updatePostRequestDto);
  }

  async deletePost(userId: number, postId: number): Promise<void> {
    const post = await this.postsRepository.findOne({ where: { id: postId, deletedAt: IsNull() } });

    if (!post) {
      throw new CustomHttpException(GLOBAL_ERRORS.POST_NOT_FOUND);
    }

    if (post.user.id !== userId) {
      throw new CustomHttpException(GLOBAL_ERRORS.FORBIDDEN);
    }

    await this.postsRepository.softDelete(postId);
  }

  async likePost(userId: number, postId: number): Promise<LikePostResponseDto> {
    const post = await this.postsRepository.findOne({
      where: { id: postId, deletedAt: IsNull() },
      relations: ['likes'],
    });

    if (!post) {
      throw new CustomHttpException(GLOBAL_ERRORS.POST_NOT_FOUND);
    }

    const isLike = post.likes.some((like) => like.id === userId);

    if (isLike) {
      post.likes = post.likes.filter((like) => like.id !== userId);
    } else {
      post.likes.push(new User({ id: userId }));
    }

    await this.postsRepository.save(post);

    return { isLike: !isLike };
  }
}
