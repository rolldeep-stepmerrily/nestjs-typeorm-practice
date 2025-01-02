import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsPositive, IsString, Length } from 'class-validator';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

import { AbstractEntity } from 'src/database';
import { User } from 'src/users/entities';

@Entity()
export class Post extends AbstractEntity<Post> {
  @ApiProperty({ description: 'post title' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 30)
  @Column({ length: 30 })
  title: string;

  @ApiProperty({ description: 'post content' })
  @IsString()
  @IsNotEmpty()
  @Column('text')
  content: string;

  @ApiProperty({ description: 'post views' })
  @IsPositive()
  @Column({ default: 0 })
  views: number;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @ManyToMany(() => User, (user) => user.likedPosts)
  @JoinTable()
  likes: User[];
}
