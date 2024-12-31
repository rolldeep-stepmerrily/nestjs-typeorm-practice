import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsNotEmpty, IsPositive, IsString, Length, Matches } from 'class-validator';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

enum ERole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity()
export class User {
  @ApiProperty({ description: 'user ID' })
  @IsPositive()
  @PrimaryGeneratedColumn()
  id: number;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}
