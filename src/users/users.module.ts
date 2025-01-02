import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule],
  providers: [UsersService, AccessTokenStrategy, RefreshTokenStrategy],
  controllers: [UsersController],
})
export class UsersModule {}
