import { ApiProperty } from '@nestjs/swagger';

import { IsDateString, IsOptional, IsPositive } from 'class-validator';
import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class AbstractEntity<T> {
  @ApiProperty({ description: 'ID' })
  @IsPositive()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'created At' })
  @IsDateString()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'updated At' })
  @IsDateString()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: 'deleted At' })
  @IsOptional()
  @IsDateString()
  @DeleteDateColumn()
  deletedAt: Date;

  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
  }
}
