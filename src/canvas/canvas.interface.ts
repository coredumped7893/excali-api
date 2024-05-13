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
  name: string;
  userId: Uuid;
}

export interface CanvasContentUpdateCommand {
  id: Uuid;
  appState: CanvasAppState;
  elements: CanvasElements;
  files: CanvasFiles;
}

export interface CanvasMetadataUpdateCommand {
  id: Uuid;
  name: string;
}

export class CanvasMetadataUpdateDTO {
  @MinLength(3)
  @MaxLength(255)
  name: string;
}

export class CanvasCreateDTO {
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
  dateCreated: Date;
  dateUpdated: Date;
  name: string;
  tags: CanvasTagDTO[];
}

export interface CanvasTagDTO {
  id: Uuid;
  name: string;
  color: string;
}

export class CanvasStateFilter {
  @IsOptional()
  versionTimestamp?: string;
  @IsUUID()
  @IsNotEmpty()
  canvasId: Uuid;
}
