import { Uuid } from '../common/common.interface';
import { MaxLength, MinLength } from 'class-validator';

export interface WorkspaceDTO {
  id: Uuid;
  name: string;
  dateCreated: Date;
}

export class WorkspaceCreateDTO {
  @MinLength(3)
  @MaxLength(255)
  name: string;
}

export interface WorkspaceCreateCommand {
  name: string;
}
