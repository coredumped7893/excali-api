import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CanvasEntity } from './entity/canvas.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
    CancelAccessCommand,
    CanvasContentUpdateCommand,
    CanvasCreateCommand,
    CanvasMetadataUpdateCommand,
    CanvasStateFilter, GiveAccessCommand,
} from './canvas.interface';
import { CanvasStateEntity } from './entity/canvas-state.entity';
import { Uuid } from '../common/common.interface';
import {
  ListFilter,
  PageableUtils,
  PagedResult,
} from '../common/pageable.utils';
import { CanvasAccessEntity } from './entity/canvas-access.entity';
import { UserEntity } from '../user/entity/user.entity';

@Injectable()
export class CanvasService {
  constructor(
    @InjectRepository(CanvasStateEntity)
    private readonly canvasStateRepository: Repository<CanvasStateEntity>,
    @InjectRepository(CanvasEntity)
    private readonly canvasRepository: Repository<CanvasEntity>,
    @InjectRepository(CanvasAccessEntity)
    private readonly canvasAccessRepository: Repository<CanvasAccessEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /**
   * Create new canvas
   */
  public async create(command: CanvasCreateCommand): Promise<CanvasEntity> {
    const user = await this.userRepository.findOne({
      where: { id: command.userId },
    });
    const canvas = new CanvasEntity();
    canvas.name = command.name;
    await this.canvasRepository.save(canvas);
    const canvasAccess = new CanvasAccessEntity();
    canvasAccess.isOwner = true;
    canvasAccess.canvas = canvas;
    canvasAccess.user = user;
    await this.canvasAccessRepository.save(canvasAccess);
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

  public async readAll(
    filter: ListFilter,
    userId: Uuid,
  ): Promise<PagedResult<CanvasEntity>> {
    const accessibleCanvases = (
      await this.canvasAccessRepository.find({
        relations: {
          canvas: true,
        },
        where: {
          user: {
            id: userId,
          },
        },
      })
    ).map((access) => access.canvas.id);

    const qb = PageableUtils.producePagedQueryBuilder(
      filter,
      this.canvasRepository.createQueryBuilder('canvas'),
    );

    qb.whereInIds(accessibleCanvases);

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

  public async giveAccess(command: GiveAccessCommand) {
    const user = await this.userRepository.findOne({
      where: { id: command.userId },
    });
    const canvas = await this.canvasRepository.findOne({
      where: { id: command.canvasId },
    });
    let canvasAccess = await this.canvasAccessRepository.findOne({
      where: { user: { id: command.userId }, canvas: { id: command.canvasId } },
    });
    if (canvasAccess) {
      return;
    }
    canvasAccess = new CanvasAccessEntity();
    canvasAccess.isOwner = false;
    canvasAccess.canvas = canvas;
    canvasAccess.user = user;
    await this.canvasAccessRepository.save(canvasAccess);
  }

  public async cancelAccess(command: CancelAccessCommand) {
    await this.canvasAccessRepository.delete({
      user: { id: command.userId },
      canvas: { id: command.canvasId },
    });
  }
}
