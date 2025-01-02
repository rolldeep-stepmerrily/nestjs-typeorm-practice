import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';

import { AbstractEntity } from 'src/database';
import { Post } from 'src/posts/entities';

import { ERole } from '../users.interface';

@Entity()
export class User extends AbstractEntity<User> {
  @ApiProperty({ description: 'user username' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]{2,10}$/)
  @Column({ length: 10, unique: true })
  username: string;

  @ApiProperty({ description: 'user password' })
  @IsString()
  @IsNotEmpty()
  @Length(8, 20)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[`~!@#$%^&*()_=+])[A-Za-z\d`~!@#$%^&*()_=+]{8,16}$/)
  @Column({ length: 256 })
  password: string;

  @ApiProperty({ description: 'user role' })
  @IsEnum(ERole)
  @Column({ type: 'enum', enum: ERole, default: ERole.USER })
  role: ERole;

  @OneToMany(() => Post, (post) => post.user, { cascade: true })
  posts: Post[];

  @ManyToMany(() => Post, (post) => post.likes)
  likedPosts: Post[];
}
