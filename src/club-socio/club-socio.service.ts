import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ErrorNegocio,
  ExcepcionLogicaNegocio,
} from '../compartido/errores-negocio';
import { ClubEntity } from '../club/club.entity';
import { SocioEntity } from '../socio/socio.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClubSocioService {
  constructor(
    @InjectRepository(ClubEntity)
    private readonly repositorioClub: Repository<ClubEntity>,

    @InjectRepository(SocioEntity)
    private readonly repositorioSocio: Repository<SocioEntity>,
  ) {}

  async agregarSocioClub(
    clubId: string,
    socioId: string,
  ): Promise<ClubEntity> {
    const socio: SocioEntity = await this.repositorioSocio.findOne({
      where: { id: socioId },
    });
    if (!socio)
      throw new ExcepcionLogicaNegocio(
        'socio dado no fue encontrado.',
        ErrorNegocio.NO_ENCONTRADO,
      );

    const club: ClubEntity =
      await this.repositorioClub.findOne({
        where: { id: clubId },
        relations: ['socios'],
      });
    if (!club)
      throw new ExcepcionLogicaNegocio(
        'Club dado no fue encontrada.',
        ErrorNegocio.NO_ENCONTRADO,
      );

    club.socios = [...club.socios, socio];
    return await this.repositorioClub.save(club);
  }

  async obtenerSocioporClub(
    clubId: string,
    socioId: string,
  ): Promise<SocioEntity> {
    return <SocioEntity>(
      (
        await this.__obtenerSocioporClub(
          clubId,
          socioId,
        )
      )[1]
    );
  }

  async obtenerTodosSociosporClub(
    clubId: string,
  ): Promise<SocioEntity[]> {
    const club: ClubEntity =
      await this.repositorioClub.findOne({
        where: { id: clubId },
        relations: ['socios'],
      });
    if (!club)
      throw new ExcepcionLogicaNegocio(
        'Club dado no fue encontrada.',
        ErrorNegocio.NO_ENCONTRADO,
      );

    return club.socios;
  }

  async asociarSocioClub(
    clubId: string,
    socios: SocioEntity[],
  ): Promise<ClubEntity> {
    const club: ClubEntity =
      await this.repositorioClub.findOne({
        where: { id: clubId },
        relations: ['socios'],
      });

    if (!club)
      throw new ExcepcionLogicaNegocio(
        'Club dado no fue encontrada.',
        ErrorNegocio.NO_ENCONTRADO,
      );

    for (let i = 0; i < socios.length; i++) {
      const socio: SocioEntity = await this.repositorioSocio.findOne({
        where: { id: socios[i].id },
      });
      if (!socio)
        throw new ExcepcionLogicaNegocio(
          'socio dado no fue encontrado.',
          ErrorNegocio.NO_ENCONTRADO,
        );
    }

    club.socios = socios;
    return await this.repositorioClub.save(club);
  }

  async eliminarSocioClub(clubId: string, socioId: string) {
    const club = <ClubEntity>(
      (
        await this.__obtenerSocioporClub(
          clubId,
          socioId,
        )
      )[0]
    );
    club.socios = club.socios.filter((e) => e.id !== socioId);
    await this.repositorioClub.save(club);
  }

  async __obtenerSocioporClub(
    clubId: string,
    socioId: string,
  ) {
    const socio: SocioEntity = await this.repositorioSocio.findOne({
      where: { id: socioId },
    });
    if (!socio)
      throw new ExcepcionLogicaNegocio(
        'socio dado no fue encontrado.',
        ErrorNegocio.NO_ENCONTRADO,
      );

    const club: ClubEntity =
      await this.repositorioClub.findOne({
        where: { id: clubId },
        relations: ['socios'],
      });
    if (!club)
      throw new ExcepcionLogicaNegocio(
        'Club dado no fue encontrada.',
        ErrorNegocio.NO_ENCONTRADO,
      );

    const clubSocio: SocioEntity = club.socios.find(
      (e) => e.id === socio.id,
    );

    if (!clubSocio)
      throw new ExcepcionLogicaNegocio(
        'Socio dado no esta asociado a club dado.',
        ErrorNegocio.PRECONDICION_FALLIDA,
      );

    return [club, clubSocio];
  }
}
