import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { RegionsService } from '../regions/regions.service';
import { Region } from './entities/region.entity';
import { StoredProceduresService } from '../stored-procedures/stored-procedures.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('regions')
@Controller('regions')
export class RegionsController {
  constructor(
    private readonly regionsService: RegionsService,
    private readonly sp: StoredProceduresService,
  ) {}

  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: [Region],
  })
  @Get()
  async findAll(): Promise<Region[]> {
    return this.regionsService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: 'List all records by code',
    type: [Region],
  })
  @Get('sp')
  async findActiveByCode(@Query('code') code: string): Promise<any> {
    return this.sp.spActiveRegionsByCode(code).then((records) => {
      const [result] = records;
      return result;
    });
  }

  @ApiResponse({
    status: 200,
    description: 'Find a record by id',
    type: Region,
  })
  @ApiResponse({
    status: 204,
    description: 'Record not found',
  })
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Region> {
    return this.regionsService.findOne(id).catch((err) => {
      throw new HttpException(
        {
          message: err.message,
        },
        HttpStatus.NO_CONTENT,
      );
    });
  }
}
