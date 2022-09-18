import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { ClubEntity } from '../club/club.entity';
import { SocioEntity } from '../socio/socio.entity';
import { Repository } from 'typeorm';
import { ClubSocioService } from './club-socio.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmConfiguracionPruebas } from '../compartido/utilidades-pruebas/typeorm-configuracion-pruebas';

describe('ClubSocioService', () => {
  let servicio: ClubSocioService;
  let repositorioClub: Repository<ClubEntity>;
  let repositorioSocio: Repository<SocioEntity>;
  let club: ClubEntity;
  let socio: SocioEntity;
  let listaSocios: SocioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmConfiguracionPruebas()],
      providers: [ClubSocioService],
    }).compile();

    servicio = module.get<ClubSocioService>(ClubSocioService);

    repositorioClub = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));

    repositorioSocio = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity),);

    await inicializarBaseDeDatos();
  });

  const inicializarBaseDeDatos = async () => {
    repositorioSocio.clear();
    repositorioClub.clear();

    listaSocios = [];
    for (let i = 0; i < 5; i++) {
      const socio: SocioEntity = await repositorioSocio.save({
        nombre: faker.lorem.sentence(),
        correo: faker.lorem.sentence(),
        fechanacimiento: faker.lorem.sentence(),
        clubes: [],
      });
      listaSocios.push(socio);
    }

    club = await repositorioClub.save({
      nombre: faker.company.name(),
      fecha: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
      descripcion: faker.lorem.sentence(),
      socios: listaSocios
    });
  };

  it('agregarSocioClub debería agregar socio a un club.', async () => {
    const nuevoSocio: SocioEntity = await repositorioSocio.save({
      nombre: faker.company.name(),
      correo: faker.lorem.sentence(),
      fechanacimiento: faker.lorem.sentence(),
      clubes: [],
    });

    const nuevoClub: ClubEntity =
      await repositorioClub.save({
        nombre: faker.company.name(),
        fecha: faker.lorem.sentence(),
        imagen: faker.image.imageUrl(),
        descripcion: faker.lorem.sentence(),
        socios: [],
      });

    const result: ClubEntity =
      await servicio.agregarSocioClub(
        nuevoClub.id,
        nuevoSocio.id,
      );

    expect(result.socios.length).toBe(1);
    expect(result.socios[0]).not.toBeNull();
    expect(result.socios[0].nombre).toBe(nuevoSocio.nombre);
    expect(result.socios[0].correo).toBe(nuevoSocio.correo);
    expect(result.socios[0].fechanacimiento).toBe(nuevoSocio.fechanacimiento);
  });

  it('should be defined', () => {
    expect(servicio).toBeDefined();
  });

  it('agregarSocioClub debería arrojar excepcion de socio inválido.', async () => {
    const nuevoClub: ClubEntity =
      await repositorioClub.save({
        nombre: faker.company.name(),
        fecha: faker.lorem.sentence(),
        imagen: faker.image.imageUrl(),
        descripcion: faker.lorem.sentence(),
        socios: [],
      });

    await expect(() =>
      servicio.agregarSocioClub(nuevoClub.id, '0'),
    ).rejects.toHaveProperty('mensaje', 'socio dado no fue encontrado.');
  });

  it('agregarSocioClub debería arrojar excepcion de club inválido.', async () => {
    const nuevoSocio: SocioEntity = await repositorioSocio.save({
      nombre: faker.company.name(),
      correo: faker.lorem.sentence(),
      fechanacimiento: faker.lorem.sentence(),
      clubes: [],
  });

    await expect(() =>
      servicio.agregarSocioClub('0', nuevoSocio.id),
    ).rejects.toHaveProperty('mensaje', 'Club dado no fue encontrada.');
  });

  it('obtenerSocioporClub deberia retornar socio por club', async () => {
    const socio: SocioEntity = listaSocios[0];
    const socioAlmacenado: SocioEntity = await servicio.obtenerSocioporClub(club.id, socio.id, )
    expect(socioAlmacenado).not.toBeNull();
    expect(socioAlmacenado.nombre).toBe(socio.nombre);
    expect(socioAlmacenado.correo).toBe(socio.correo);
    expect(socioAlmacenado.fechanacimiento).toBe(socio.fechanacimiento);
  });

  it('obtenerSocioporClub debería arrojar excepcion de socio inválido.', async () => {
    await expect(() =>
      servicio.obtenerSocioporClub(club.id, '0'),
    ).rejects.toHaveProperty('mensaje', 'socio dado no fue encontrado.');
  });

  it('obtenerSocioporClub debería arrojar excepcion de club inválido.', async () => {
    const socio: SocioEntity = listaSocios[0];
    await expect(() =>
      servicio.obtenerSocioporClub('0', socio.id),
    ).rejects.toHaveProperty('mensaje', 'Club dado no fue encontrada.',);
  });

  it('obtenerSocioporClub debería arrojar excepcion de socio no asociado a club.', async () => {
    const nuevoSocio: SocioEntity = await repositorioSocio.save({
      nombre: faker.company.name(),
      correo: faker.lorem.sentence(),
      fechanacimiento: faker.lorem.sentence(),
      clubes: [],
  });

    await expect(() =>
      servicio.obtenerSocioporClub(club.id, nuevoSocio.id),
    ).rejects.toHaveProperty(
      'mensaje',
      'Socio dado no esta asociado a club dado.',
    );
  });

  it('obtenerTodosSociosporClub deberia retornar socios por club', async () => {
    const socios: SocioEntity[] =
      await servicio.obtenerTodosSociosporClub(club.id);
    expect(socios.length).toBe(5);
  });

  it('obtenerTodosSociosporClub debería arrojar excepcion de club inválido.', async () => {
    await expect(() =>
      servicio.obtenerTodosSociosporClub('0'),
    ).rejects.toHaveProperty(
      'mensaje',
      'Club dado no fue encontrada.',
    );
  });

  it('asociarSocioClub debería actualizar la lista de socios de un club.', async () => {
    const nuevoSocio: SocioEntity = await repositorioSocio.save({
      nombre: faker.company.name(),
      correo: faker.lorem.sentence(),
      fechanacimiento: faker.lorem.sentence(),
      clubes: [],
    });

    const socioActualizado: ClubEntity =
      await servicio.asociarSocioClub(club.id, [
        nuevoSocio,
      ]);
    expect(socioActualizado.socios.length).toBe(1);

    expect(socioActualizado.socios[0].nombre).toBe(nuevoSocio.nombre);
    expect(socioActualizado.socios[0].correo).toBe(nuevoSocio.correo);
    expect(socioActualizado.socios[0].fechanacimiento).toBe(nuevoSocio.fechanacimiento);
  });

  it('asociarSocioClub debería arrojar excepcion de club inválido.', async () => {
    const nuevoSocio: SocioEntity = await repositorioSocio.save({
      nombre: faker.lorem.sentence(),
      correo: faker.lorem.sentence(),
      fechanacimiento: faker.lorem.sentence(),
      clubes: [],
  });

    await expect(() =>
      servicio.asociarSocioClub('0', [nuevoSocio]),
    ).rejects.toHaveProperty(
      'mensaje',
      'Club dado no fue encontrada.',
    );
  });

  it('asociarSocioClub debería arrojar excepcion de inválido.', async () => {
    const nuevoSocio: SocioEntity = listaSocios[0];
    nuevoSocio.id = '0';

    await expect(() =>
      servicio.asociarSocioClub(club.id, [nuevoSocio]),
    ).rejects.toHaveProperty('mensaje', 'socio dado no fue encontrado.');
  });

  it('eliminarSocioClub debería remover un socio del club.', async () => {
    const socio: SocioEntity = listaSocios[0];

    await servicio.eliminarSocioClub(club.id, socio.id);

    const clubAlmacenado: ClubEntity =
      await repositorioClub.findOne({
        where: { id: club.id },
        relations: ['socios'],
      });
    const deletedSocio: SocioEntity = clubAlmacenado.socios.find(
      (a) => a.id === socio.id,
    );

    expect(deletedSocio).toBeUndefined();
  });

  it('eliminarSocioClub debería arrojar excepcion de socio inválido.', async () => {
    await expect(() =>
      servicio.eliminarSocioClub(club.id, '0'),
    ).rejects.toHaveProperty('mensaje', 'socio dado no fue encontrado.');
  });

  it('eliminarSocioClub  debería arrojar excepcion de club inválido.', async () => {
    const socio: SocioEntity = listaSocios[0];
    await expect(() =>
      servicio.eliminarSocioClub('0', socio.id),
    ).rejects.toHaveProperty(
      'mensaje',
      'club dado no fue encontrada.',
    );
  });

  
});
