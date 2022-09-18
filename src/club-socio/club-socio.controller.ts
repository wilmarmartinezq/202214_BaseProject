import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { SocioEntity } from '../socio/socio.entity';
import { SocioService } from '../socio/socio.service';
import { ErroresNegocioInterceptor } from 'src/compartido/interceptores/errores-negocio.interceptor';
import { ClubSocioService } from './club-socio.service';

@Controller('clubes')
@UseInterceptors(ErroresNegocioInterceptor)
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
    return await this.servicioClubSocio.agregarSocioClub(clubId, socioId);
  }

  @Get(':clubId/socios/:socioId')
  async obtenerRecetaSocioClub(
    @Param('clubId') clubId: string,
    @Param('socioId') socioId: string,
  ) {
    return await this.servicioClubSocio.obtenerSocioClub(clubId, socioId);
  }

  @Get(':clubId/socios')
  async obtenerTodosSociosClub(
    @Param('clubId') clubId: string,
  ) {
    return await this.servicioClubSocio.obtenerTodosSociosClub(clubId);
  }

  @Put(':clubId/socios')
  async associateSociosClub(
    @Body() sociosIds: string[],
    @Param('clubId') clubId: string,
  ) {
    const socios: SocioEntity[] = [];
    for (let i = 0; i < sociosIds.length; i++) {
      const socio = await this.servicioSocio.findOne(sociosIds[i]);
      socios.push(socio);
    }

    return await this.servicioClubSocio.asociarSociosClub(
      clubId,
      socios,
    );
  }

  @Delete(':clubId/socios/:socioId')
  @HttpCode(204)
  async deleteSociosClub(
    @Param('clubId') clubId: string,
    @Param('socioId') socioId: string,
  ) {
    return await this.servicioClubSocio.eliminarSocioClub(clubId, socioId);
  }
}
