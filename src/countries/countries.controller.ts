import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CountriesService } from './countries.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { Country } from './entities/country.entity';

@ApiTags('countries')
@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: [Country],
  })
  @Get()
  async findAll(): Promise<Country[]> {
    return this.countriesService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: 'Find a record by id',
    type: Country,
  })
  @ApiResponse({
    status: 204,
    description: 'Record not found',
  })
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Country> {
    return this.countriesService.findOne(id).catch((err) => {
      throw new HttpException(
        {
          message: err.message,
        },
        HttpStatus.NO_CONTENT,
      );
    });
  }

  @ApiResponse({
    status: 201,
    description: 'Successfully created record',
    type: Country,
  })
  @ApiResponse({
    status: 500,
    description: 'Record not created',
  })
  @Post()
  @HttpCode(201)
  async create(@Body() createCountryDto: CreateCountryDto): Promise<Country> {
    return this.countriesService.create(createCountryDto).catch((err) => {
      throw new InternalServerErrorException(err.message);
    });
  }

  @ApiResponse({
    status: 200,
    description: 'Successfully updated record',
    type: Country,
  })
  @ApiResponse({
    status: 500,
    description: 'Record not updated',
  })
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCountryDto: UpdateCountryDto,
  ): Promise<Country> {
    return this.countriesService.update(id, updateCountryDto).catch((err) => {
      throw new InternalServerErrorException(err.message);
    });
  }

  @ApiResponse({
    status: 200,
    description: 'Successfully deleted record',
    schema: {
      type: 'object',
      properties: {
        deleted: {
          type: 'boolean',
          example: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Record not deleted',
  })
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ deleted: boolean }> {
    return this.countriesService.remove(id).catch((err) => {
      throw new InternalServerErrorException(err.message);
    });
  }
}
