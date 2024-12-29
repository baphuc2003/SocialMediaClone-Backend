import { Injectable } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('publicKey')
export class PublicKeyEntity {
  @Column()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column('text')
  @IsNotEmpty()
  token: string;

  @Column()
  created_at: Date;
}
