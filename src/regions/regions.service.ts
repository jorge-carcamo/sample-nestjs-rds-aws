import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Region } from './entities/region.entity';

@Injectable()
export class RegionsService {
  constructor(
    @InjectRepository(Region) private regionsRepository: Repository<Region>,
  ) {}

  async findAll(): Promise<Region[]> {
    return this.regionsRepository.find();
  }

  async findOne(id: number): Promise<Region> {
    return this.regionsRepository.findOneOrFail({ id });
  }
}
