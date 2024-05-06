import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('canvas_tag')
export class CanvasTagEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({
    nullable: true,
    length: 7,
  })
  color: string;
}
