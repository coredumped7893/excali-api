import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthenticatedGuard } from '../../auth/guard/authenticated.guard';
import { CanvasGuard } from './canvas.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { CanvasAccessEntity } from '../entity/canvas-access.entity';
import { Repository } from 'typeorm';
import { CanvasEntity } from '../entity/canvas.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CanvasPublicGuard implements CanActivate {
  constructor(
    @InjectRepository(CanvasAccessEntity)
    private readonly canvasAccessRepository: Repository<CanvasAccessEntity>,
    @InjectRepository(CanvasEntity)
    private readonly canvasRepository: Repository<CanvasEntity>,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const authenticatedGuard = new AuthenticatedGuard();
    const canvasGuard = new CanvasGuard(this.canvasAccessRepository);
    const authenticatedAccess = authenticatedGuard.canActivate(context);
    const canvasAccess = canvasGuard.canActivate(context);

    const request = context.switchToHttp().getRequest();
    const canvasId = request.params.id;
    const canvas = await this.canvasRepository.findOne({
      where: {
        id: canvasId,
      },
      relations: {
        tags: true,
      },
    });
    const shared = canvas?.tags
      .map((tag) => tag.name)
      .includes(this.configService.get('SHARED_TAG_NAME'));

    return shared || (authenticatedAccess && canvasAccess);
  }
}
