import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { Country } from './entities/country.entity';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Country) private countriesRepository: Repository<Country>,
  ) {}

  async findAll(): Promise<Country[]> {
    return this.countriesRepository.find();
  }

  async findOne(id: number): Promise<Country> {
    return this.countriesRepository.findOneOrFail({ id });
  }

  async create(createCountryDto: CreateCountryDto): Promise<Country> {
    const newCountry = this.countriesRepository.create(createCountryDto);
    await this.countriesRepository.save(newCountry);
    return newCountry;
  }

  async update(
    id: number,
    updateCountryDto: UpdateCountryDto,
  ): Promise<Country> {
    await this.countriesRepository.update({ id }, updateCountryDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.countriesRepository.delete({ id });
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }
}
