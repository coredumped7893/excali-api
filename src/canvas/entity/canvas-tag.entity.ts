import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('canvas_tag')
@Unique(['name'])
export class CanvasTagEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({
    nullable: true,
    length: 7,
  })
  color: string;
}
