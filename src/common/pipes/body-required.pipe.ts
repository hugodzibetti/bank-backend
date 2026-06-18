import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class BodyRequiredPipe implements PipeTransform {
  transform(value: unknown) {
    if (value == undefined) {
      throw new BadRequestException('Request body is required');
    }

    return value;
  }
}
