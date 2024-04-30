import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { WorkspaceEntity } from './workspace.entity';
import { UserEntity } from '../../user/entity/user.entity';

@Entity('workspace_access')
export class WorkspaceAccessEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => WorkspaceEntity, { nullable: false })
  workspace: WorkspaceEntity;

  @ManyToOne(() => UserEntity, { nullable: false })
  user: UserEntity;

  @Column({ default: false, nullable: false })
  isOwner: boolean;
}
