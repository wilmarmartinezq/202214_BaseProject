import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorNegocio, ExcepcionLogicaNegocio } from '../compartido/errores-negocio';
import { Repository } from 'typeorm';
import { ClubEntity } from './club.entity';

@Injectable()
export class ClubService {

    constructor(
        @InjectRepository(ClubEntity)
        private readonly clubRepository: Repository<ClubEntity>,
    ){}

    async create(club: ClubEntity): Promise<ClubEntity> {
        return await this.clubRepository.save(club);
    }

    async findAll(): Promise<ClubEntity[]> {
        return await this.clubRepository.find();
    }

    async findOne(id: string): Promise<ClubEntity> {
        const club: ClubEntity = await this.clubRepository.findOne({where:{id}});
        if (!club)
          throw new ExcepcionLogicaNegocio("El club con el solicitado id no existe", ErrorNegocio.NO_ENCONTRADO);
    
        return club;
    }


    async update(id: string, club: ClubEntity): Promise<ClubEntity> {
        const persistedClub: ClubEntity = await this.clubRepository.findOne({where:{id}});
        if (!persistedClub)
          throw new ExcepcionLogicaNegocio("El club con el id solicitado no existe", ErrorNegocio.NO_ENCONTRADO);
        
        return await this.clubRepository.save({...persistedClub, ...club});
    }

    async delete(id: string) {
        const club: ClubEntity = await this.clubRepository.findOne({where:{id}});
        if (!club)
          throw new ExcepcionLogicaNegocio("El club con el id solicitado no existe", ErrorNegocio.NO_ENCONTRADO);
      
        await this.clubRepository.remove(club);
    }

}
