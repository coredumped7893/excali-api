import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkspaceEntity } from './entity/workspace.entity';
import {
  ListFilter,
  PageableUtils,
  PagedResult,
} from '../common/pageable.utils';
import { Uuid } from '../common/common.interface';
import { WorkspaceCreateCommand } from './workspace.interface';
import { CanvasService } from '../canvas/canvas.service';
import { WorkspaceAccessEntity } from './entity/workspace-access.entity';
import { UserEntity } from '../user/entity/user.entity';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
    @InjectRepository(WorkspaceAccessEntity)
    private readonly workspaceAccessRepository: Repository<WorkspaceAccessEntity>,
    private readonly canvasService: CanvasService,
  ) {}

  //Read workspace by id
  public async readById(id: Uuid): Promise<WorkspaceEntity> {
    return this.workspaceRepository.findOne({
      where: {
        id,
      },
    });
  }

  public async readAll(
    filter: ListFilter,
  ): Promise<PagedResult<WorkspaceEntity>> {
    const qb = PageableUtils.producePagedQueryBuilder(
      filter,
      this.workspaceRepository.createQueryBuilder('workspace'),
    );

    return PageableUtils.producePagedResult(
      filter,
      await qb
        .leftJoinAndSelect('workspace.canvases', 'canvas')
        .getManyAndCount(),
    );
  }

  /**
   * Create a new workspace.
   *
   * @param {WorkspaceCreateCommand} createCommand - The create command containing the details of the workspace.
   * @param userUid
   * @returns {Promise<Workspace>} - A promise that resolves to the created workspace.
   */
  public async create(
    createCommand: WorkspaceCreateCommand,
    userUid: Uuid,
  ): Promise<WorkspaceEntity> {
    //`.save()` is used instead of `.create()` as we need the new uid before exiting
    const workspace = await this.workspaceRepository.save(createCommand);

    console.log(workspace);

    //Assign by default ownership of the workspace
    await this.workspaceAccessRepository.save({
      workspace,
      isOwner: true,
      user: new UserEntity(userUid),
    });

    //Create new default canvas
    await this.canvasService.create({
      workspaceId: workspace.id,
      name: 'Default',
    });

    return workspace;
  }
}
