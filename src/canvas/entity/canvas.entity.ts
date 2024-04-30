import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { WorkspaceEntity } from '../../workspace/entity/workspace.entity';
import { Uuid } from '../../common/common.interface';

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

  @ManyToOne(() => WorkspaceEntity, { nullable: false })
  workspace: WorkspaceEntity;

  @RelationId((canvas: CanvasEntity) => canvas.workspace)
  workspaceId: Uuid;
}
