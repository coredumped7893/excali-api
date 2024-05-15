import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CanvasEntity } from './entity/canvas.entity';
import { CanvasController } from './canvas.controller';
import { CanvasService } from './canvas.service';
import { CanvasStateEntity } from './entity/canvas-state.entity';
import { CanvasTagEntity } from './entity/canvas-tag.entity';
import { CanvasAccessEntity } from './entity/canvas-access.entity';
import { UserEntity } from '../user/entity/user.entity';
import { CanvasTagController } from './canvas-tag.controller';
import { CanvasTagService } from './canvas-tag.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CanvasEntity,
      CanvasTagEntity,
      CanvasStateEntity,
      CanvasAccessEntity,
      UserEntity,
    ]),
  ],
  controllers: [CanvasController, CanvasTagController],
  providers: [CanvasService, CanvasTagService],
  exports: [CanvasService, CanvasTagService],
})
export class CanvasModule {}
