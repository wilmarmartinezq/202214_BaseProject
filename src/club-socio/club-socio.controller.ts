import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { SocioEntity } from '../socio/socio.entity';
import { SocioService } from '../socio/socio.service';
import { ErroresNegocioInterceptor } from '../compartido/interceptores/errores-negocio.interceptor';
import { ClubSocioService } from './club-socio.service';

@UseInterceptors(ErroresNegocioInterceptor)
@Controller('clubes')
export class ClubSocioController {
  constructor(
    private readonly servicioClubSocio: ClubSocioService,
    private readonly servicioSocio: SocioService,
  ) {}

  @Post(':clubId/socios/:socioId')
  async agregarSocioClub(
    @Param('clubId') clubId: string,
    @Param('socioId') socioId: string,
  ) {
    return await this.servicioClubSocio.agregarSocioClub(
      clubId,
      socioId,
    );
  }

  @Get(':clubId/socios/:socioId')
  async obtenerSocioClub(
    @Param('clubId') clubId: string,
    @Param('socioId') socioId: string,
  ) {
    return await this.servicioClubSocio.obtenerSocioporClub(
      clubId,
      socioId,
    );
  }

  @Get(':clubId/socios')
  async obtenerTodosSociosDeClub(
    @Param('clubId') clubId: string,
  ) {
    return await this.servicioClubSocio.obtenerTodosSociosporClub(
      clubId,
    );
  }

  @Put(':clubId/socios')
  async associateSocioClub(
    @Body() sociosIds: string[],
    @Param('clubId') clubId: string,
  ) {
    const socios: SocioEntity[] = [];
    for (let i = 0; i < sociosIds.length; i++) {
      const socio = await this.servicioSocio.findOne(sociosIds[i]);
      socios.push(socio);
    }

    return await this.servicioClubSocio.asociarSocioClub(
      clubId,
      socios,
    );
  }

  @Delete(':clubId/socios/:socioId')
  @HttpCode(204)
  async deleteSocioClub(
    @Param('clubId') clubId: string,
    @Param('socioId') socioId: string,
  ) {
    return await this.servicioClubSocio.eliminarSocioClub(
      clubId,
      socioId,
    );
  }
}
