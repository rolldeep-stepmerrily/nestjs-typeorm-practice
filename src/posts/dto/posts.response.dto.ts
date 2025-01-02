import { ApiProperty, PickType } from '@nestjs/swagger';

import { IsBoolean } from 'class-validator';

import { User } from 'src/users/entities';

import { Post } from '../entities';

class UserResponseDto extends PickType(User, ['id', 'username'] as const) {}

export class PostResponseDto extends PickType(Post, ['id', 'title', 'views', 'createdAt'] as const) {
  @ApiProperty({ description: 'author' })
  user: UserResponseDto;

  @ApiProperty({ description: 'likes count' })
  likesCount: number;
}

export class FindPostsResponseDto {
  @ApiProperty({ type: [PostResponseDto], description: 'posts' })
  posts: PostResponseDto[];
}

export class CreatePostResponseDto extends PickType(Post, ['id'] as const) {}

export class FindDetailedPostResponseDto extends PickType(Post, [
  'id',
  'title',
  'content',
  'views',
  'createdAt',
] as const) {
  @ApiProperty({ description: 'author' })
  user: UserResponseDto;

  @ApiProperty({ description: 'likes count' })
  likesCount: number;
}

export class LikePostResponseDto {
  @ApiProperty({ description: 'is like' })
  @IsBoolean()
  isLike: boolean;
}
