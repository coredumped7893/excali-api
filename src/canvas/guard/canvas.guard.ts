import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CanvasAccessEntity } from '../entity/canvas-access.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CanvasGuard implements CanActivate {
  constructor(
    @InjectRepository(CanvasAccessEntity)
    private readonly canvasAccessRepository: Repository<CanvasAccessEntity>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const canvasId = request.params.id;
    const userId = request.user.toString();

    const canvasAccess = await this.canvasAccessRepository.findOne({
      where: { canvas: { id: canvasId }, user: { id: userId } },
    });

    return !!canvasAccess;
  }
}
