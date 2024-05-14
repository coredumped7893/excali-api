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
import { ListFilter } from '../common/pageable.utils';

@Controller('/canvas-tag')
export class CanvasTagController {
  constructor(private readonly canvasTagService: CanvasTagService) {}

  @Post()
  @UseGuards(AuthenticatedGuard)
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
  public async readById(@Param('id') id: Uuid): Promise<CanvasTagDTO> {
    return await this.canvasTagService.readById(id);
  }

  @Get('/')
  @UseGuards(AuthenticatedGuard)
  public async readAll(@Query() filter: ListFilter): Promise<any> {
    return await this.canvasTagService.readAll(filter);
  }

  @Put('/:id')
  @UseGuards(AuthenticatedGuard)
  public async update(
    @Param('id') id: Uuid,
    @Body() dto: CanvasTagCreateOrUpdateDTO,
  ): Promise<CanvasTagDTO> {
    return await this.canvasTagService.update({
      ...dto,
      id,
    });
  }

  @Delete('/:id')
  @UseGuards(AuthenticatedGuard)
  public async delete(@Param('id') id: Uuid) {
    await this.canvasTagService.delete({ id });
  }
}
