import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CanvasEntity } from './entity/canvas.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CanvasContentUpdateCommand,
  CanvasCreateCommand,
  CanvasMetadataUpdateCommand,
  CanvasStateFilter,
} from './canvas.interface';
import { CanvasStateEntity } from './entity/canvas-state.entity';
import { Uuid } from '../common/common.interface';
import {
  ListFilter,
  PageableUtils,
  PagedResult,
} from '../common/pageable.utils';

@Injectable()
export class CanvasService {
  constructor(
    @InjectRepository(CanvasStateEntity)
    private readonly canvasStateRepository: Repository<CanvasStateEntity>,
    @InjectRepository(CanvasEntity)
    private readonly canvasRepository: Repository<CanvasEntity>,
  ) {}

  /**
   * Create new canvas
   */
  public async create(command: CanvasCreateCommand): Promise<CanvasEntity> {
    const canvas = new CanvasEntity();
    canvas.name = command.name;
    await this.canvasRepository.save(canvas);
    return canvas;
  }

  /**
   * Append new CanvasState object to the DB
   */
  public async updateCanvasContent(
    command: CanvasContentUpdateCommand,
  ): Promise<CanvasEntity> {
    //Read canvas from DB
    const canvas = await this.canvasRepository.findOneBy({ id: command.id });
    if (!canvas) {
      throw new NotFoundException();
    }

    const canvasState = CanvasStateEntity.new(canvas);
    canvasState.appState = command.appState;
    canvasState.appState.collaborators = []; // Workaround for ExcaliDraw 0.17.3 initial state bug
    canvasState.elements = command.elements;
    canvasState.files = command.files;

    await this.canvasStateRepository.save(canvasState);

    return canvas;
  }

  public async updateCanvasMetadata(
    command: CanvasMetadataUpdateCommand,
  ): Promise<CanvasEntity> {
    const canvas = await this.canvasRepository.findOneBy({ id: command.id });

    if (!canvas) {
      throw new NotFoundException();
    }

    canvas.name = command.name;
    await this.canvasRepository.save(canvas);

    return canvas;
  }

  public async readById(id: Uuid): Promise<CanvasEntity> {
    return this.canvasRepository.findOne({
      where: {
        id,
      },
      relations: {
        tags: true,
      },
    });
  }

  public async readAll(filter: ListFilter): Promise<PagedResult<CanvasEntity>> {
    const qb = PageableUtils.producePagedQueryBuilder(
      filter,
      this.canvasRepository.createQueryBuilder('canvas'),
    );

    return PageableUtils.producePagedResult(
      filter,
      await qb.leftJoinAndSelect('canvas.tags', 'tags').getManyAndCount(),
    );
  }

  private produceEmptyCanvasState(canvasId?: Uuid): Partial<CanvasStateEntity> {
    return {
      canvasId,
      appState: {},
      elements: [],
      files: {},
    };
  }

  public async readState(
    filter: CanvasStateFilter,
  ): Promise<CanvasStateEntity> {
    const queryBuilder = this.canvasStateRepository
      .createQueryBuilder()
      .addOrderBy('"dateCreated"', 'DESC');
    queryBuilder.andWhere({ canvasId: filter.canvasId });

    //If no timestamp value in filter is provided, return latest version
    if (filter.versionTimestamp) {
      queryBuilder.andWhere({ dateCreated: filter.versionTimestamp });
    }

    return (
      (await queryBuilder.getOne()) ||
      (this.produceEmptyCanvasState(filter.canvasId) as CanvasStateEntity) //If state is empty return default one
    );
  }
}
