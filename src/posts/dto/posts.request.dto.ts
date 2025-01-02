import { PickType } from '@nestjs/swagger';

import { Post } from '../entities';

export class CreatePostRequestDto extends PickType(Post, ['title', 'content'] as const) {}
