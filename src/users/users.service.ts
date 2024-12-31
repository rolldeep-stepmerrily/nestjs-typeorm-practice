import { HttpStatus, Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { CustomHttpException } from '@@exceptions';

import { CreateUserRequestDto } from './dto/users.request.dto';
import { CreateUserResponseDto } from './dto/users.response.dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findUserByUsername(username: string): Promise<User | null> {
    return await this.usersRepository.findUserByUsername(username);
  }

  async createUser(createUserRequestDto: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    const findUser = await this.findUserByUsername(createUserRequestDto.username);

    if (findUser) {
      throw new CustomHttpException({
        statusCode: HttpStatus.CONFLICT,
        message: 'username already exists',
        errorCode: 'E0002',
      });
    }

    const hashedPassword = await bcrypt.hash(createUserRequestDto.password, 10);

    const user = new User({ ...createUserRequestDto, password: hashedPassword });

    const createdUser = await this.usersRepository.createUser(user);

    return { id: createdUser.id };
  }
}
