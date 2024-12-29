import { Module } from '@nestjs/common';
import { PublicKeyEntity } from './public-key.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PublicKeyEntity])],
  exports: [TypeOrmModule],
})
export class PublicKeyModule {}
