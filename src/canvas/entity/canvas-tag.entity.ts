import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('canvas_tag')
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
  @Column({ length: 1024, nullable: true })
  description: string;
}
