import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EntityManager, Repository } from 'typeorm';

import { User } from 'src/users/entities';

import { CreatePostRequestDto } from './dto/posts.request.dto';
import { CreatePostResponseDto, FindDetailedPostResponseDto, FindPostsResponseDto } from './dto/posts.response.dto';
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
      relations: ['user'],
      select: { id: true, title: true, likes: true, views: true, createdAt: true, user: { id: true, username: true } },
    });

    return { posts };
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
    return await this.postsRepository.findOneOrFail({
      where: { id: postId },
      relations: ['user'],
      select: {
        id: true,
        title: true,
        content: true,
        likes: true,
        views: true,
        createdAt: true,
        user: { id: true, username: true },
      },
    });
  }
}
