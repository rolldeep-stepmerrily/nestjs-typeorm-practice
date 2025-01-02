import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { CustomHttpException } from '@@exceptions';

import { User } from '../entities';
import { IValidate } from '../users.interface';
import { UsersService } from '../users.service';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET_KEY'),
    });
  }

  async validate({ sub, id }: IValidate): Promise<User> {
    if (sub !== 'access') {
      throw new CustomHttpException({
        statusCode: HttpStatus.FORBIDDEN,
        errorCode: 'E0006',
        message: 'invalid token',
      });
    }

    const user = await this.usersService.findUserById(id);

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
