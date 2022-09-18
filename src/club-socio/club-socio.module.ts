import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocioEntity } from '../socio/socio.entity';
import { ClubEntity } from '../club/club.entity';
import { ClubSocioController } from './club-socio.controller';
import { ClubSocioService } from './club-socio.service';
import { SocioService } from '../socio/socio.service';

@Module({
  imports: [TypeOrmModule.forFeature([ClubEntity, SocioEntity])],
  providers: [ClubSocioService, SocioService],
  controllers: [ClubSocioController]
})
export class ClubSocioModule {}
