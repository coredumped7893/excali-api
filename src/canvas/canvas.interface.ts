import {
  CanvasAppState,
  CanvasElements,
  CanvasFiles,
  Uuid,
} from '../common/common.interface';
import {
  IsNotEmpty,
  IsOptional,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export interface CanvasCreateCommand {
  workspaceId: Uuid;
  name: string;
}

export interface CanvasContentUpdateCommand {
  id: Uuid;
  appState: CanvasAppState;
  elements: CanvasElements;
  files: CanvasFiles;
}

export interface CanvasMetadataUpdateCommand {
  id: Uuid;
  workspaceId: Uuid;
  name: string;
}

export class CanvasMetadataUpdateDTO {
  workspaceId: Uuid;
  @MinLength(3)
  @MaxLength(255)
  name: string;
}

export class CanvasCreateDTO {
  workspaceId: Uuid;
  @MinLength(3)
  @MaxLength(255)
  name: string;
}

export interface CanvasContentUpdateDto {
  appState: CanvasAppState;
  elements: CanvasElements;
  files: CanvasFiles;
}

export interface CanvasDTO {
  id: Uuid;
  workspaceId: Uuid;
  dateCreated: Date;
  dateUpdated: Date;
  name: string;
}

export class CanvasStateFilter {
  @IsOptional()
  versionTimestamp?: string;
  @IsUUID()
  @IsNotEmpty()
  canvasId: Uuid;
}
