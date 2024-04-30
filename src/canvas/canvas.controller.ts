import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CanvasService } from './canvas.service';
import {
  CanvasContentUpdateDto,
  CanvasCreateDTO,
  CanvasDTO,
  CanvasMetadataUpdateDTO,
  CanvasStateFilter,
} from './canvas.interface';
import { Uuid } from '../common/common.interface';
import { ListFilter } from '../common/pageable.utils';
import { AuthenticatedGuard } from '../auth/guard/authenticated.guard';

@Controller('/canvas')
export class CanvasController {
  constructor(private readonly canvasService: CanvasService) {}

  /**
   * Creates a new canvas.
   *
   * @param {CanvasCreateDTO} createDto - The data transfer object containing the canvas details.
   *
   * @returns {Promise<CanvasDTO>} - The promise of a CanvasDTO object representing the created canvas.
   *
   * Example input:
   * ```json
   * {
   * "workspaceId":"bbe58d3e-3f17-4108-bb85-579e2ce3b1b3",
   * "name":"Canvas1"
   * }
   * ```
   *
   * Example output:
   * ```json
   * {
   *     "id": "2a204754-603d-47b5-a217-5622bf8432b1",
   *     "name": "Canvas1",
   *     "workspaceId": "bbe58d3e-3f17-4108-bb85-579e2ce3b1b3"
   * }
   * ```
   *
   */
  @Post()
  @UseGuards(AuthenticatedGuard)
  public async createNewCanvas(
    @Body() createDto: CanvasCreateDTO,
  ): Promise<CanvasDTO> {
    const canvas = await this.canvasService.create(createDto);
    return {
      id: canvas.id,
      name: canvas.name,
      workspaceId: canvas.workspace.id,
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
   *     "workspaceId": "ff32d967-844e-4d89-a832-ed73302e31a3",
   *     "name": "New name example"
   * }
   * ```
   *
   * Example output response:
   * ```json
   * {
   *     "id": "412f90c4-55d4-4a01-8dc0-2cd16edcc1ef",
   *     "name": "New name example",
   *     "workspaceId": "ff32d967-844e-4d89-a832-ed73302e31a3"
   * }
   * ```
   *
   * @param {string} id - The ID of the canvas to update.
   * @param {CanvasMetadataUpdateDTO} updateDto - The data to update the canvas metadata.
   * @returns {Promise<CanvasDTO>} - A promise that resolves to the updated canvas.
   */
  @Patch('/:id')
  @UseGuards(AuthenticatedGuard)
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
      workspaceId: canvas.workspace.id,
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
   *     "workspaceId": "bbe58d3e-3f17-4108-bb85-579e2ce3b1b3"
   * }
   * ```
   *
   * @param id - The ID of the canvas.
   * @param appendStateDto - The data transfer object representing the state to append to the canvas content.
   * @returns A Promise that resolves to a CanvasDTO object representing the updated canvas.
   */
  @Post('/:id/state')
  @UseGuards(AuthenticatedGuard)
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
      workspaceId: canvas.workspaceId,
      dateCreated: canvas.dateCreated,
      dateUpdated: canvas.dateUpdated,
    };
  }

  @Get('/state')
  public async readState(@Query() filter: CanvasStateFilter) {
    return this.canvasService.readState(filter);
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
   *     "workspaceId": "bbe58d3e-3f17-4108-bb85-579e2ce3b1b3"
   * }
   * ```
   *
   *
   * @param {string} uuid - The UUID of the canvas to be retrieved.
   * @returns {Promise<CanvasDTO>} - A Promise that resolves to the retrieved CanvasDTO object.
   */
  @Get('/:uuid')
  @UseGuards(AuthenticatedGuard)
  public async readById(@Param('uuid') uuid: Uuid): Promise<CanvasDTO> {
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
   *             "workspaceId": "bbe58d3e-3f17-4108-bb85-579e2ce3b1b3"
   *         }
   *     ]
   * }
   * ```
   *
   * @param {ListFilter} filter - The filter to apply when retrieving items.
   * @return {Promise<any>} - A Promise that resolves to the retrieved items.
   */
  @Get('/')
  @UseGuards(AuthenticatedGuard)
  public async readAll(@Query() filter: ListFilter): Promise<any> {
    return this.canvasService.readAll(filter);
  }
}
