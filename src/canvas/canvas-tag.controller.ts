import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CanvasTagService } from './canvas-tag.service';
import { CanvasTagCreateOrUpdateDTO, CanvasTagDTO } from './canvas.interface';
import { AuthenticatedGuard } from '../auth/guard/authenticated.guard';
import { Uuid } from '../common/common.interface';
import { ListFilter, PagedResult } from '../common/pageable.utils';
import { Roles } from '../auth/decorator/roles.decorator';
import { RolesGuard } from '../auth/guard/roles.guard';
import { UuidPipe } from '../common/uuid.pipe';

@Controller('/canvas-tag')
export class CanvasTagController {
  constructor(private readonly canvasTagService: CanvasTagService) {}

  @Post()
  @Roles(['ADMIN'])
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async create(
    @Body() dto: CanvasTagCreateOrUpdateDTO,
  ): Promise<CanvasTagDTO> {
    const tag = await this.canvasTagService.create(dto);
    return {
      id: tag.id,
      name: tag.name,
      color: tag.color,
    };
  }

  @Get('/:id')
  @UseGuards(AuthenticatedGuard)
  public async readById(
    @Param('id', UuidPipe) id: Uuid,
  ): Promise<CanvasTagDTO> {
    return await this.canvasTagService.readById(id);
  }

  @Get('/')
  @UseGuards(AuthenticatedGuard)
  public async readAll(
    @Query() filter: ListFilter,
  ): Promise<PagedResult<CanvasTagDTO>> {
    return await this.canvasTagService.readAll(filter);
  }

  @Put('/:id')
  @Roles(['ADMIN'])
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async update(
    @Param('id', UuidPipe) id: Uuid,
    @Body() dto: CanvasTagCreateOrUpdateDTO,
  ): Promise<CanvasTagDTO> {
    return await this.canvasTagService.update({
      ...dto,
      id,
    });
  }

  @Delete('/:id')
  @Roles(['ADMIN'])
  @UseGuards(AuthenticatedGuard, RolesGuard)
  public async delete(@Param('id', UuidPipe) id: Uuid) {
    await this.canvasTagService.delete({ id });
  }
}
