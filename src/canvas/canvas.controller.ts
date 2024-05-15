import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CanvasService } from './canvas.service';
import {
  CanvasAccessDTO,
  CanvasContentUpdateDto,
  CanvasCreateDTO,
  CanvasDTO,
  CanvasMetadataUpdateDTO,
  CanvasModifyTagDTO,
  CanvasStateFilter,
} from './canvas.interface';
import { Uuid } from '../common/common.interface';
import {ListFilter, PagedResult} from '../common/pageable.utils';
import { AuthenticatedGuard } from '../auth/guard/authenticated.guard';
import { CanvasGuard } from './guard/canvas.guard';
import { Log } from '@algoan/nestjs-logging-interceptor';
import { Request } from 'express';
import { CanvasPublicGuard } from './guard/canvas.public.guard';

@Controller('/canvas')
export class CanvasController {
  constructor(private readonly canvasService: CanvasService) {}

  /**
   * Creates a new canvas.
   *
   * @param {CanvasCreateDTO} createDto - The data transfer object containing the canvas details.
   *
   * @param req - HTTP request object
   * @returns {Promise<CanvasDTO>} - The promise of a CanvasDTO object representing the created canvas.
   *
   * Example input:
   * ```json
   * {
   * "name":"Canvas1"
   * }
   * ```
   *
   * Example output:
   * ```json
   * {
   *     "id": "2a204754-603d-47b5-a217-5622bf8432b1",
   *     "name": "Canvas1",
   * }
   * ```
   *
   */
  @Post()
  @UseGuards(AuthenticatedGuard)
  public async createNewCanvas(
    @Body() createDto: CanvasCreateDTO,
    @Req() req: Request,
  ): Promise<CanvasDTO> {
    const userId = req.user.toString();
    const canvas = await this.canvasService.create({ ...createDto, userId });
    return {
      id: canvas.id,
      name: canvas.name,
      tags: canvas.tags,
      dateCreated: canvas.dateCreated,
      dateUpdated: canvas.dateUpdated,
    };
  }

  /**
   * Updates the metadata of a canvas.
   * Requires authentication.
   *
   * Example body:
   * ```json
   * {
   *     "name": "New name example"
   * }
   * ```
   *
   * Example output response:
   * ```json
   * {
   *     "id": "412f90c4-55d4-4a01-8dc0-2cd16edcc1ef",
   *     "name": "New name example",
   * }
   * ```
   *
   * @param {string} id - The ID of the canvas to update.
   * @param {CanvasMetadataUpdateDTO} updateDto - The data to update the canvas metadata.
   * @returns {Promise<CanvasDTO>} - A promise that resolves to the updated canvas.
   */
  @Patch('/:id')
  @UseGuards(AuthenticatedGuard, CanvasGuard)
  public async updateCanvasMetadata(
    @Param('id') id: Uuid,
    @Body() updateDto: CanvasMetadataUpdateDTO,
  ): Promise<CanvasDTO> {
    const canvas = await this.canvasService.updateCanvasMetadata({
      ...updateDto,
      id,
    });
    //@TODO create external mapper function
    return {
      id: canvas.id,
      name: canvas.name,
      tags: canvas.tags,
      dateCreated: canvas.dateCreated,
      dateUpdated: canvas.dateUpdated,
    };
  }

  /**
   * Appends a new state to the canvas content of a canvas with the given ID.
   * Requires authentication.
   *
   * Example body:
   * ```json
   * {
   *     "appState":
   *     {
   *         "color": "red"
   *     },
   *     "elements":
   *     [
   *         {}
   *     ],
   *     "files":
   *     [
   *         {}
   *     ],
   * }
   * ```
   *
   * Example response:
   * ```json
   * {
   *     "id": "e28d9f95-487c-4c32-ad88-c0437c8fdb13",
   *     "name": "Canvas1",
   * }
   * ```
   *
   * @param id - The ID of the canvas.
   * @param appendStateDto - The data transfer object representing the state to append to the canvas content.
   * @returns A Promise that resolves to a CanvasDTO object representing the updated canvas.
   */
  @Post('/:id/state')
  @UseGuards(AuthenticatedGuard, CanvasGuard)
  public async appendCanvasState(
    @Param('id') id: Uuid,
    @Body() appendStateDto: CanvasContentUpdateDto,
  ): Promise<CanvasDTO> {
    const canvas = await this.canvasService.updateCanvasContent({
      ...appendStateDto,
      id,
    });
    return {
      id: canvas.id,
      name: canvas.name,
      tags: canvas.tags,
      dateCreated: canvas.dateCreated,
      dateUpdated: canvas.dateUpdated,
    };
  }

  @Log({
    mask: {
      response: ['appState', 'elements', 'files'],
    },
  })
  @Get('/:id/state')
  @UseGuards(CanvasPublicGuard)
  public async readState(
    @Param('id') id: Uuid,
    @Query() filter: CanvasStateFilter,
  ) {
    return this.canvasService.readState(id, filter);
  }

  /**
   * Retrieves a canvas by its UUID.
   *
   * Example response:
   * ```json
   * {
   *     "id": "473ef9c2-df6a-4fb8-b414-1bee23c60f17",
   *     "name": "Canvas1",
   *     "dateCreated": "2024-04-19T16:56:02.442Z",
   *     "dateUpdated": "2024-04-19T16:56:02.442Z",
   * }
   * ```
   *
   *
   * @param {string} uuid - The UUID of the canvas to be retrieved.
   * @returns {Promise<CanvasDTO>} - A Promise that resolves to the retrieved CanvasDTO object.
   */
  @Get('/:id')
  @UseGuards(CanvasPublicGuard)
  public async readById(@Param('id') uuid: Uuid): Promise<CanvasDTO> {
    return await this.canvasService.readById(uuid);
  }

  /**
   * Retrieves all items from the database based on the provided filter.
   *
   * Example request:
   * ```
   * GET http://localhost:3000/api/canvas?page=1&pageSize=1
   * ```
   *
   * Example response:
   * ```json
   * {
   *     "page": {
   *         "totalItems": 5,
   *         "totalPages": 5,
   *         "pageSize": 1,
   *         "pageNumber": 1
   *     },
   *     "data": [
   *         {
   *             "id": "473ef9c2-df6a-4fb8-b414-1bee23c60f17",
   *             "name": "Canvas1",
   *             "dateCreated": "2024-04-19T16:56:02.442Z",
   *             "dateUpdated": "2024-04-19T16:56:02.442Z",
   *         }
   *     ]
   * }
   * ```
   *
   * @param {ListFilter} filter - The filter to apply when retrieving items.
   * @param req - HTTP request object
   * @return {Promise<CanvasDTO>} - A Promise that resolves to the retrieved items.
   */
  @Get('/')
  @UseGuards(AuthenticatedGuard)
  public async readAll(
    @Query() filter: ListFilter,
    @Req() req: Request,
  ): Promise<PagedResult<CanvasDTO>> {
    return await this.canvasService.readAll(filter, req.user.toString());
  }

  /**
   * Gives access to a single canvas for a single user
   * @param canvasId
   * @param dto - an object containing 'userId'
   */
  @Post('/:id/access')
  @UseGuards(AuthenticatedGuard, CanvasGuard)
  public async giveAccess(
    @Param('id') canvasId: Uuid,
    @Body() dto: CanvasAccessDTO,
  ) {
    const userId = dto.userId;
    await this.canvasService.giveAccess({ canvasId, userId });
  }

  /**
   * Removes access to a single canvas for a single user
   * @param canvasId
   * @param dto - an object containing 'userId'
   */
  @Delete('/:id/access')
  @UseGuards(AuthenticatedGuard, CanvasGuard)
  public async cancelAccess(
    @Param('id') canvasId: Uuid,
    @Body() dto: CanvasAccessDTO,
  ) {
    const userId = dto.userId;
    await this.canvasService.cancelAccess({ canvasId, userId });
  }

  /**
   * Adds a single tag to a canvas
   * @param canvasId
   * @param dto - an object containing 'tagId'
   */
  @Post('/:id/tags')
  @UseGuards(AuthenticatedGuard, CanvasGuard)
  public async addTags(
    @Param('id') canvasId: Uuid,
    @Body() dto: CanvasModifyTagDTO,
  ) {
    const tagIds = dto.tagIds;
    await this.canvasService.addTags({ canvasId, tagIds });
  }

  /**
   * Removes a single tag from a canvas
   * @param canvasId
   * @param dto - an object containing 'tagId'
   */
  @Delete('/:id/tags')
  @UseGuards(AuthenticatedGuard, CanvasGuard)
  public async removeTags(
    @Param('id') canvasId: Uuid,
    @Body() dto: CanvasModifyTagDTO,
  ) {
    const tagIds = dto.tagIds;
    await this.canvasService.removeTags({ canvasId, tagIds });
  }
}
