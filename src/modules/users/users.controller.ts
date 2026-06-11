import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { LocalGuard } from '../../common/guards/local.guard';

@UseGuards(LocalGuard)
@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('find')
  find(@Query('id', ParseIntPipe) id: number) {
    return this.userService.find(id);
  }
}
