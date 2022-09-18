import { ClubEntity } from '../club/club.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class SocioEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  correo: string;


  @Column()
  fechanacimiento: string;

  @ManyToMany(() => ClubEntity, (club) => club.socios)
  @JoinTable()
  clubes: ClubEntity[];
}
