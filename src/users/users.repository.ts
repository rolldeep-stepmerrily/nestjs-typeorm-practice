import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EntityManager, Repository } from 'typeorm';

import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    private readonly entityManager: EntityManager,
  ) {}

  async findUserByUsername(username: string): Promise<User | null> {
    return await this.repository.findOne({ where: { username }, select: { id: true } });
  }

  async createUser(user: User) {
    return await this.entityManager.save(user);
  }
}
