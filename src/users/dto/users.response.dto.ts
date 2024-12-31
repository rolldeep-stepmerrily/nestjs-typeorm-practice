import { PickType } from '@nestjs/swagger';

import { User } from '../entities/user.entity';

export class CreateUserResponseDto extends PickType(User, ['id'] as const) {}
