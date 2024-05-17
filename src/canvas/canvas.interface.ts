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

export interface GiveAccessCommand {
  canvasId: Uuid;
  personId: Uuid;
}

export interface CancelAccessCommand {
  userId: Uuid;
  canvasId: Uuid;
  personId: Uuid;
}

export interface GiveAccessByTagCommand {
  userId: Uuid;
  tagIds: Uuid[];
  personIds: Uuid[];
}

export interface CancelAccessByTagCommand {
  userId: Uuid;
  tagIds: Uuid[];
}

export interface CanvasAddTagCommand {
  canvasId: Uuid;
  tagIds: Uuid[];
}

export interface CanvasRemoveTagCommand {
  canvasId: Uuid;
  tagIds: Uuid[];
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

export class CanvasAccessDTO {
  @IsUUID()
  @IsNotEmpty()
  personId: Uuid;
}

export class GiveCanvasAccessByTagDTO {
  @IsUUID('all', { each: true })
  @IsNotEmpty({ each: true })
  @IsNotEmpty()
  tagIds: Uuid[];
  @IsUUID('all', { each: true })
  @IsNotEmpty({ each: true })
  @IsNotEmpty()
  personIds: Uuid[];
}

export class CancelCanvasAccessByTagDTO {
  @IsUUID('all', { each: true })
  @IsNotEmpty({ each: true })
  @IsNotEmpty()
  tagIds: Uuid[];
}

export class CanvasStateFilter {
  @IsOptional()
  versionTimestamp?: string;
}

export interface CanvasTagCreateCommand {
  name: string;
  color?: string;
}

export interface CanvasTagUpdateCommand {
  id: Uuid;
  name: string;
  color?: string;
}

export interface CanvasTagDeleteCommand {
  id: Uuid;
}

export class CanvasTagCreateOrUpdateDTO {
  @MinLength(3)
  @MaxLength(12)
  name: string;
  @IsOptional()
  @MinLength(7)
  @MaxLength(7)
  color?: string;
}

export class CanvasModifyTagDTO {
  @IsUUID('all', { each: true })
  @IsNotEmpty({ each: true })
  @IsNotEmpty()
  tagIds: Uuid[];
}
