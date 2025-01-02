import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy, ExtractJwt } from 'passport-jwt';

import { CustomHttpException } from '@@exceptions';

import { User } from '../entities';
import { IValidate } from '../users.interface';
import { UsersService } from '../users.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET_KEY'),
    });
  }

  async validate({ id: userId }: IValidate): Promise<User> {
    const user = await this.usersService.findUserById(userId);

    if (!user) {
      throw new CustomHttpException({
        statusCode: HttpStatus.NOT_FOUND,
        errorCode: 'E0004',
        message: 'user not found',
      });
    }

    if (user.deletedAt) {
      throw new CustomHttpException({
        statusCode: HttpStatus.UNAUTHORIZED,
        errorCode: 'E0007',
        message: 'withdrawal user',
      });
    }

    return user;
  }
}
