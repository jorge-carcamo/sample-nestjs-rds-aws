import { Module } from '@nestjs/common';
import { RegionsService } from './regions.service';
import { RegionsController } from './regions.controller';
import { Region } from './entities/region.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoredProceduresService } from '../stored-procedures/stored-procedures.service';

@Module({
  imports: [TypeOrmModule.forFeature([Region])],
  controllers: [RegionsController],
  providers: [RegionsService, StoredProceduresService],
})
export class RegionsModule {}
