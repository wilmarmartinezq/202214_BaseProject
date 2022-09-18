
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubModule } from './club/club.module';
import { ClubEntity } from './club/club.entity';
import { SocioModule } from './socio/socio.module';
import { SocioEntity } from './socio/socio.entity';
import { ClubSocioModule } from './club-socio/club-socio.module';



@Module({
  imports: [
    ClubModule,
    SocioModule,
    ClubSocioModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'clubsocial',
      entities: [
        ClubEntity,
        SocioEntity,
      ],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),

  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
