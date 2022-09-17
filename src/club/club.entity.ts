import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SocioEntity } from '../socio/socio.entity';
import { Url } from 'url';

@Entity()
export class ClubEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  fecha: string;

  @Column()
  imagen: string;

  @Column()
  descripcion: string;
}
