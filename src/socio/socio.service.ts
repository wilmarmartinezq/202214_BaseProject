import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorNegocio, ExcepcionLogicaNegocio } from '../compartido/errores-negocio';
import { SocioEntity } from './socio.entity';


@Injectable()
export class SocioService {

    constructor(
        @InjectRepository(SocioEntity)
        private readonly socioRepository: Repository<SocioEntity>,
    ){}

    async create(socio: SocioEntity): Promise<SocioEntity> {
        return await this.socioRepository.save(socio);
    }

    async findAll(): Promise<SocioEntity[]> {
        return await this.socioRepository.find();
    }

    async findOne(id: string): Promise<SocioEntity> {
        const socio: SocioEntity = await this.socioRepository.findOne({where:{id}});
        if (!socio)
          throw new ExcepcionLogicaNegocio("El socio con el solicitado id no existe", ErrorNegocio.NO_ENCONTRADO);
    
        return socio;
    }


    async update(id: string, socio: SocioEntity): Promise<SocioEntity> {
        const persistedSocio: SocioEntity = await this.socioRepository.findOne({where:{id}});
        if (!persistedSocio)
          throw new ExcepcionLogicaNegocio("El socio con el id solicitado no existe", ErrorNegocio.NO_ENCONTRADO);
        
        return await this.socioRepository.save({...persistedSocio, ...socio});
    }

    async delete(id: string) {
        const socio: SocioEntity = await this.socioRepository.findOne({where:{id}});
        if (!socio)
          throw new ExcepcionLogicaNegocio("El socio con el id solicitado no existe", ErrorNegocio.NO_ENCONTRADO);
      
        await this.socioRepository.remove(socio);
    }


}
