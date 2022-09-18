import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmConfiguracionPruebas } from '../compartido/utilidades-pruebas/typeorm-configuracion-pruebas';
import { faker } from '@faker-js/faker';
import { ClubService } from './club.service';
import { ClubEntity } from './club.entity';

describe('ClubService', () => {
  let service: ClubService;
  let clubesList: ClubEntity[];
  let repository: Repository<ClubEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmConfiguracionPruebas()],
      providers: [ClubService],
    }).compile();

    service = module.get<ClubService>(ClubService);
    repository = module.get<Repository<ClubEntity>>(
      getRepositoryToken(ClubEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    clubesList = [];
    for (let i = 0; i < 5; i++) {
      const club: ClubEntity = await repository.save({
        nombre: faker.lorem.sentence(),
        fecha: faker.lorem.sentence(),
        imagen: faker.image.imageUrl(),
        descripcion: faker.lorem.sentence(),
      });
      clubesList.push(club);
    }
  };

  it('Obtener todos debería retornar todos los clubes', async () => {
    const clubes: ClubEntity[] = await service.findAll();
    expect(clubes).not.toBeNull();
    expect(clubes).toHaveLength(clubesList.length);
  });

  it('Obtener una debería retornar un club por id', async () => {
    const storedClub: ClubEntity = clubesList[0];
    const club: ClubEntity = await service.findOne(storedClub.id);
    expect(club).not.toBeNull();
    expect(club.nombre).toEqual(storedClub.nombre);
    expect(club.fecha).toEqual(storedClub.fecha);
    expect(club.imagen).toEqual(storedClub.imagen);
    expect(club.descripcion).toEqual(storedClub.descripcion);
  });


  it('actualizar debería modificar un club', async () => {
    const club: ClubEntity = clubesList[0];
    club.nombre = 'Nuevo nombre';
    club.descripcion = 'Cambio en descripcion';

    const updatedClub: ClubEntity = await service.update(club.id, club);
    expect(updatedClub).not.toBeNull();

    const storedClub: ClubEntity = await repository.findOne({
      where: { id: club.id },
    });
    expect(storedClub).not.toBeNull();
    expect(storedClub.nombre).toEqual(club.nombre);
    expect(storedClub.descripcion).toEqual(club.descripcion);
  });

  it('eliminar debería eliminar un club', async () => {
    const club: ClubEntity = clubesList[0];
    await service.delete(club.id);

    const deletedClub: ClubEntity = await repository.findOne({
      where: { id: club.id },
    });
    expect(deletedClub).toBeNull();
  });
});
