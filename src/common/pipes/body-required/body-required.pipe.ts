import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class BodyRequiredPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value == undefined) {
      throw new BadRequestException('Request body is required');
    }

    return value;
  }
}
