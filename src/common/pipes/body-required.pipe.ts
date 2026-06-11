import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class BodyRequiredPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    if (metadata.type !== 'body') {
      return Error('The BodyRequiredPipe should used only for body data');
    }

    if (value === undefined) {
      throw new BadRequestException('Request body is required');
    }

    return value;
  }
}