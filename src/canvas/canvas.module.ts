import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CanvasEntity } from './entity/canvas.entity';
import { CanvasController } from './canvas.controller';
import { CanvasService } from './canvas.service';
import { CanvasStateEntity } from './entity/canvas-state.entity';
import { CanvasTagEntity } from './entity/canvas-tag.entity';
import { CanvasAccessEntity } from './entity/canvas-access.entity';
import { UserEntity } from '../user/entity/user.entity';

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
  controllers: [CanvasController],
  providers: [CanvasService],
  exports: [CanvasService],
})
export class CanvasModule {}
