import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ParseObjectIdPipe } from '@nestjs/mongoose';

import { RoadInputDto } from '../../types/road/DTOs/road-input.dto';
import { RoadService } from './road.service';
import { Public, Roles } from 'nest-keycloak-connect';

const OptionalParseIntPipe = new ParseIntPipe({ optional: true });

@Controller('road')
export class RoadController {
  constructor(private readonly roadService: RoadService) {}

  @Public()
  @Get()
  getAll(
    @Query('page', OptionalParseIntPipe) page: number | null,
    @Query('pageSize', OptionalParseIntPipe) pageSize: number | null,
  ) {
    this.roadService.getAll(page || 1, pageSize || 10);
  }

  @Public()
  @Get(':id')
  getSingle(@Param('id', ParseObjectIdPipe) id: string) {
    this.roadService.getSingle(id);
  }

  @Roles({ roles: ['admin'] })
  @Post()
  create(@Body() model: RoadInputDto) {
    this.roadService.create(model);
  }

  @Roles({ roles: ['admin'] })
  @Put(':id')
  edit(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() model: RoadInputDto,
  ) {
    this.roadService.edit(id, model);
  }

  @Roles({ roles: ['admin'] })
  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    this.roadService.remove(id);
  }
}
