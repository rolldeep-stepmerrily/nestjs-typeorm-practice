import { PickType } from '@nestjs/swagger';

import { User } from '../entities';

export class CreateUserRequestDto extends PickType(User, ['username', 'password'] as const) {}

export class SignInRequestDto extends PickType(User, ['username', 'password'] as const) {}
