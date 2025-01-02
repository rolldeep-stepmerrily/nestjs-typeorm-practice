import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';
import { EntityManager, Repository } from 'typeorm';

import { CustomHttpException } from '@@exceptions';

import { CreateUserRequestDto, SignInRequestDto } from './dto/users.request.dto';
import { CreateUserResponseDto, SignInResponseDto } from './dto/users.response.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly entityManager: EntityManager,
    private readonly jwtService: JwtService,
    @Inject('JWT_SECRET_KEY') private readonly jwtSecretKey: string,
  ) {}

  async findUserByUsername(username: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { username }, select: { id: true, password: true } });
  }

  async findUserById(id: number): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { id },
      select: { id: true, username: true, password: true, role: true, deletedAt: true },
    });
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

    const createdUser = await this.entityManager.save(user);

    return { id: createdUser.id };
  }

  async signIn({ username, password }: SignInRequestDto): Promise<SignInResponseDto> {
    const foundUser = await this.findUserByUsername(username);

    if (!foundUser) {
      throw new CustomHttpException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'user not found',
        errorCode: 'E0004',
      });
    }

    const isValidPassword = await bcrypt.compare(password, foundUser.password);
    if (!isValidPassword) {
      throw new CustomHttpException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'invalid password',
        errorCode: 'E0005',
      });
    }

    const { id } = foundUser;

    return {
      accessToken: this.jwtService.sign({ sub: 'access', id }, { secret: this.jwtSecretKey, expiresIn: '1h' }),
      refreshToken: this.jwtService.sign({ sub: 'refresh', id }, { secret: this.jwtSecretKey }),
    };
  }
}
