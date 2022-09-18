import { SocioEntity } from '../socio/socio.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @ManyToMany(
    () => SocioEntity,
    (socio) => socio.clubes,
  )
  socios: SocioEntity[];
}
