import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CanvasEntity } from './entity/canvas.entity';
import { CanvasController } from './canvas.controller';
import { WorkspaceEntity } from '../workspace/entity/workspace.entity';
import { CanvasService } from './canvas.service';
import { CanvasStateEntity } from './entity/canvas-state.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CanvasEntity,
      WorkspaceEntity,
      CanvasStateEntity,
    ]),
  ],
  controllers: [CanvasController],
  providers: [CanvasService],
  exports: [CanvasService],
})
export class CanvasModule {}
