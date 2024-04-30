import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CanvasEntity } from '../../canvas/entity/canvas.entity';

@Entity('workspace')
export class WorkspaceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCreated: Date;

  @OneToMany(() => CanvasEntity, (canvas) => canvas.workspace)
  canvases: CanvasEntity[];

  constructor(id: string) {
    this.id = id;
  }
}
