import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceEntity } from './entity/workspace.entity';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceAccessEntity } from './entity/workspace-access.entity';
import { WorkspaceService } from './workspace.service';
import { CanvasModule } from '../canvas/canvas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkspaceEntity, WorkspaceAccessEntity]),
    CanvasModule,
  ],
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
})
export class WorkspaceModule {}
