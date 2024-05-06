import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CanvasTagEntity } from './canvas-tag.entity';

@Entity('canvas')
export class CanvasEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCreated: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateUpdated: Date;

  @ManyToMany(() => CanvasTagEntity)
  @JoinTable({
    name: 'canvas_tags',
  })
  tags: CanvasTagEntity[];
}
