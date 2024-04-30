import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Uuid } from '../common/common.interface';
import { WorkspaceCreateDTO, WorkspaceDTO } from './workspace.interface';
import { WorkspaceService } from './workspace.service';
import { ListFilter, PagedResult } from '../common/pageable.utils';
import { AuthenticatedGuard } from '../auth/guard/authenticated.guard';
import { Request } from 'express';

@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  /**
   * Retrieves a list of workspaces based on the provided filter.
   *
   * @param {ListFilter} filter - The filter object used to specify the conditions for retrieving workspaces.
   * This object should contain properties such as offset, limit, orderBy, etc.
   *
   * Example response:
   * ```json
   * {
   *     "page": {
   *         "totalItems": 2,
   *         "totalPages": 1,
   *         "pageSize": 10,
   *         "pageNumber": 1
   *     },
   *     "data": [
   *         {
   *             "id": "bbe58d3e-3f17-4108-bb85-579e2ce3b1b3",
   *             "name": "Test Workspace",
   *             "dateCreated": "2024-04-18T22:08:54.340Z"
   *         },
   *         {
   *             "id": "ff32d967-844e-4d89-a832-ed73302e31a3",
   *             "name": "Other",
   *             "dateCreated": "2024-04-18T22:56:53.492Z"
   *         }
   *     ]
   * }
   * ```
   *
   * @return {Promise<any>} A Promise that resolves with the list of workspaces matching the provided filter.
   *
   */
  @Get('/')
  @UseGuards(AuthenticatedGuard)
  public async readAll(
    @Query() filter: ListFilter,
  ): Promise<PagedResult<WorkspaceDTO>> {
    return this.workspaceService.readAll(filter);
  }

  @Post('/')
  @UseGuards(AuthenticatedGuard)
  public async create(
    @Body() createDto: WorkspaceCreateDTO,
    @Req() req: Request,
  ) {
    return this.workspaceService.create(createDto, req.user.toString());
  }

  /**
   * Retrieves a workspace by its UUID.
   *
   * @param {string} uuid - The UUID of the workspace to retrieve.
   * @returns {Promise<WorkspaceDTO>} The workspace with the specified UUID.
   */
  @Get('/:uuid')
  @UseGuards(AuthenticatedGuard)
  public async readById(@Param('uuid') uuid: Uuid): Promise<WorkspaceDTO> {
    return await this.workspaceService.readById(uuid);
  }
}
