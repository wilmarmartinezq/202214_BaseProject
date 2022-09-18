import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmConfiguracionPruebas } from '../compartido/utilidades-pruebas/typeorm-configuracion-pruebas';
import { faker } from '@faker-js/faker';
import { SocioService } from './socio.service';
import { SocioEntity } from './socio.entity';

describe('SocioService', () => {
  let service: SocioService;
  let sociosList: SocioEntity[];
  let repository: Repository<SocioEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmConfiguracionPruebas()],
      providers: [SocioService],
    }).compile();

    service = module.get<SocioService>(SocioService);
    repository = module.get<Repository<SocioEntity>>(
      getRepositoryToken(SocioEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    sociosList = [];
    for (let i = 0; i < 1; i++) {
      const socio: SocioEntity = await repository.save({
        nombre: faker.lorem.sentence(),
        correo: faker.lorem.sentence(),
        fechanacimiento: faker.lorem.sentence(),
      });
      sociosList.push(socio);
    }
  };

  it('crear debería retornar un nuevo socio', async () => {
    const socio: SocioEntity = {
      id: '',
      nombre: faker.lorem.sentence(),
      correo: faker.lorem.sentence(),
      fechanacimiento: faker.lorem.sentence(),
    };

    const newSocio: SocioEntity = await service.create(socio);
    expect(newSocio).not.toBeNull();

    const storedSocio: SocioEntity = await repository.findOne({
      where: { id: newSocio.id },
    });
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.nombre).toEqual(newSocio.nombre);
    expect(storedSocio.correo).toEqual(newSocio.correo);
    expect(storedSocio.fechanacimiento).toEqual(newSocio.fechanacimiento);

  });

  it('Obtener todos debería retornar todos los socios', async () => {
    const socios: SocioEntity[] = await service.findAll();
    expect(socios).not.toBeNull();
    expect(socios).toHaveLength(sociosList.length);
  });

  it('Obtener una debería retornar un socio por id', async () => {
    const storedSocio: SocioEntity = sociosList[0];
    const socio: SocioEntity = await service.findOne(storedSocio.id);
    expect(socio).not.toBeNull();
    expect(socio.nombre).toEqual(storedSocio.nombre);
  });

  it('actualizar debería modificar un socio', async () => {
    const socio: SocioEntity = sociosList[0];
    socio.nombre = 'Nuevo nombre';

    const updatedSocio: SocioEntity = await service.update(socio.id, socio);
    expect(updatedSocio).not.toBeNull();

    const storedSocio: SocioEntity = await repository.findOne({
      where: { id: socio.id },
    });
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.nombre).toEqual(socio.nombre);
  });

  it('eliminar debería eliminar un socio', async () => {
    const socio: SocioEntity = sociosList[0];
    await service.delete(socio.id);

    const deletedSocio: SocioEntity = await repository.findOne({
      where: { id: socio.id },
    });
    expect(deletedSocio).toBeNull();
  });

});
