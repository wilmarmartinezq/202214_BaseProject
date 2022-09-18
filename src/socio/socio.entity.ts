import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClubEntity } from '../club/club.entity';


@Entity()
export class SocioEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  correo: string;

  @Column()
  fechanacimiento: Date;

  @ManyToMany(() => ClubEntity, club => club.socios)
  @JoinTable()
  clubes: ClubEntity[];



}
