import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CanvasAccessEntity } from '../entity/canvas-access.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as uuidValidate } from 'uuid';

@Injectable()
export class CanvasGuard implements CanActivate {
  constructor(
    @InjectRepository(CanvasAccessEntity)
    private readonly canvasAccessRepository: Repository<CanvasAccessEntity>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const canvasId = request.params.id;
    if (!canvasId || !uuidValidate(canvasId)) {
      return true;
    }
    const userId = request.user;
    if (!userId) {
      return false;
    }

    const canvasAccess = await this.canvasAccessRepository.findOne({
      where: { canvas: { id: canvasId }, user: { id: userId } },
    });

    return !!canvasAccess;
  }
}
