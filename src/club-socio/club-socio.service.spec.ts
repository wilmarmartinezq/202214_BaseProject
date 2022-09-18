import { Test, TestingModule } from '@nestjs/testing';
import { ClubSocioService } from './club-socio.service';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';
import { ClubEntity } from '../club/club.entity';
import { SocioEntity } from '../socio/socio.entity';
import { TypeOrmConfiguracionPruebas } from '../compartido/utilidades-pruebas/typeorm-configuracion-pruebas';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ClubSocioService', () => {
  let servicio: ClubSocioService;
  let repositorioClub: Repository<ClubEntity>;
  let repositorioSocio: Repository<SocioEntity>;
  let listaSocios: SocioEntity[];
  let club: ClubEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmConfiguracionPruebas()],
      providers: [ClubSocioService],
    }).compile();

    servicio = module.get<ClubSocioService>(ClubSocioService);

    repositorioClub = module.get<Repository<ClubEntity>>(
      getRepositoryToken(ClubEntity),
    );

    repositorioSocio = module.get<Repository<SocioEntity>>(
      getRepositoryToken(SocioEntity),
    );

    await inicializarBaseDeDatos();
  });

  const inicializarBaseDeDatos = async () => {
    repositorioSocio.clear();
    repositorioClub.clear();

    listaSocios = [];
    for (let i = 0; i < 5; i++) {
      const socio: SocioEntity = await repositorioSocio.save({
        nombre: faker.company.name(),
        clubes: [],
      });
      listaSocios.push(socio);
    }

    club = await repositorioClub.save({
      nombre: faker.company.name(),
      socios: listaSocios,
    });
  };

  it('debería estar definido', () => {
    expect(servicio).toBeDefined();
  });

  it('agregarSocioClub debería agregar socio a club.', async () => {
    const nuevoSocio: SocioEntity = await repositorioSocio.save({
      nombre: faker.company.name(),
      clubes: [],
    });

    const nuevoClub: ClubEntity = await repositorioClub.save({
      nombre: faker.company.name(),
      socios: [],
    });

    const result: ClubEntity = await servicio.agregarSocioClub(
      nuevoClub.id,
      nuevoSocio.id,
    );

    expect(result.socios.length).toBe(1);
    expect(result.socios[0]).not.toBeNull();
    expect(result.socios[0].nombre).toBe(nuevoSocio.nombre);
  });

  it('agregarSocioClub debería arrojar excepcion de socio inválido.', async () => {
    const nuevoClub: ClubEntity = await repositorioClub.save({
      nombre: faker.company.name(),
      socios: [],
    });

    await expect(() =>
      servicio.agregarSocioClub(nuevoClub.id, '0'),
    ).rejects.toHaveProperty('mensaje', 'Socio dado no fue encontrado.');
  });

  it('agregarSocioClub debería arrojar excepcion de club inválido.', async () => {
    const nuevoSocio: SocioEntity = await repositorioSocio.save({
      nombre: faker.company.name(),
      clubes: [],
    });

    await expect(() =>
      servicio.agregarSocioClub('0', nuevoSocio.id),
    ).rejects.toHaveProperty('mensaje', 'Club dado no fue encontrado.');
  });

  it('obtenerSocioClub debería retornar un socio del club.', async () => {
    const socio: SocioEntity = listaSocios[0];
    const socioAlmacenado: SocioEntity = await servicio.obtenerSocioClub(
      club.id,
      socio.id,
    );
    expect(socioAlmacenado).not.toBeNull();
    expect(socioAlmacenado.nombre).toBe(socio.nombre);
  });

  it('obtenerSocioClub debería arrojar excepcion de socio inválido.', async () => {
    await expect(() =>
      servicio.obtenerSocioClub(club.id, '0'),
    ).rejects.toHaveProperty('mensaje', 'Socio dado no fue encontrado.');
  });

  it('obtenerSocioClub debería arrojar excepcion de club inválido.', async () => {
    const socio: SocioEntity = listaSocios[0];
    await expect(() =>
      servicio.obtenerSocioClub('0', socio.id),
    ).rejects.toHaveProperty('mensaje', 'Club dado no fue encontrado.');
  });

  it('obtenerSocioClub debería arrojar excepcion de socio no asociado a club.', async () => {
    const nuevoSocio: SocioEntity = await repositorioSocio.save({
      nombre: faker.company.name(),
      clubes: [],
    });

    await expect(() =>
      servicio.obtenerSocioClub(club.id, nuevoSocio.id),
    ).rejects.toHaveProperty(
      'mensaje',
      'Socio dado no se encuentra asociado a Club dado.',
    );
  });

  it('obtenerTodosSociosClub debería retornar todos los socios de un club', async () => {
    const socios: SocioEntity[] = await servicio.obtenerTodosSociosClub(
      club.id,
    );
    expect(socios.length).toBe(5);
  });

  it('obtenerTodosSociosClub debería arrojar excepcion de club inválido.', async () => {
    await expect(() =>
      servicio.obtenerTodosSociosClub('0'),
    ).rejects.toHaveProperty('mensaje', 'Club dado no fue encontrado.');
  });

  it('asociarSocioClub debería actualizar la lista de socios de un club.', async () => {
    const nuevoSocio: SocioEntity = await repositorioSocio.save({
      nombre: faker.company.name(),
      clubes: [],
    });

    const clubActualizado: ClubEntity = await servicio.asociarSocioClub(
      club.id,
      [nuevoSocio],
    );
    expect(clubActualizado.socios.length).toBe(1);

    expect(clubActualizado.socios[0].nombre).toBe(nuevoSocio.nombre);
  });

  it('asociarSocioClub debería arrojar excepcion de club inválido.', async () => {
    const nuevoSocio: SocioEntity = await repositorioSocio.save({
      nombre: faker.company.name(),
      clubes: [],
    });

    await expect(() =>
      servicio.asociarSociosClub('0', [nuevoSocio]),
    ).rejects.toHaveProperty('mensaje', 'Club dado no fue encontrado.');
  });

  it('asociarSociosClub debería arrojar excepcion de socio inválido.', async () => {
    const nuevoSocio: SocioEntity = listaSocios[0];
    nuevoSocio.id = '0';

    await expect(() =>
      servicio.asociarSociosClub(club.id, [nuevoSocio]),
    ).rejects.toHaveProperty('mensaje', 'Socio dado no fue encontrado.');
  });

  it('eliminarSocioClub debería remover un socio de un club.', async () => {
    const socio: SocioEntity = listaSocios[0];

    await servicio.eliminarSocioClub(club.id, socio.id);

    const clubAlmacenado: ClubEntity = await repositorioClub.findOne({
      where: { id: club.id },
      relations: ['socios'],
    });
    const socioEliminado: SocioEntity = clubAlmacenado.socios.find(
      (a) => a.id === socios.id,
    );

    expect(socioEliminado).toBeUndefined();
  });

  it('eliminarSocioClub debería arrojar excepcion de socio inválido.', async () => {
    await expect(() =>
      servicio.eliminarSocioClub(club.id, '0'),
    ).rejects.toHaveProperty('mensaje', 'Socio dado no fue encontrado.');
  });

  it('eliminarSocioClub debería arrojar excepcion de club inválido.', async () => {
    const socio: SocioEntity = listaSocios[0];
    await expect(() =>
      servicio.eliminarSocioClub('0', socio.id),
    ).rejects.toHaveProperty('mensaje', 'Club dado no fue encontrado.');
  });

  it('eliminarSocioClub debería arrojar excepcion de socio no asociado a club.', async () => {
    const nuevoSocio: SocioEntity = await repositorioSocio.save({
      nombre: faker.company.name(),
      clubes: [],
    });

    await expect(() =>
      servicio.eliminarSocioClub(club.id, nuevoSocio.id),
    ).rejects.toHaveProperty(
      'mensaje',
      'Socio dado no se encuentra asociado a Club dado.',
    );
  });
});
