import { ApiProperty, PickType } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

import { User } from '../entities';

export class CreateUserResponseDto extends PickType(User, ['id'] as const) {}

export class SignInResponseDto {
  @ApiProperty({ description: 'access token' })
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty({ description: 'refresh token' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
