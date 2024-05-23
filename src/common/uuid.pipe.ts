import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { ArgumentMetadata } from '@nestjs/common/interfaces/features/pipe-transform.interface';
import { Uuid } from './common.interface';

@Injectable()
export class UuidPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): Uuid {
    if (uuidValidate(value)) {
      return value;
    }
    throw new BadRequestException(`${metadata.data} must be a valid uuid`);
  }
}
