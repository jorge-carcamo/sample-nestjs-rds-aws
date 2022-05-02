import { Injectable } from '@nestjs/common';
import { Region } from '../regions/entities/region.entity';
import { Connection } from 'typeorm';

@Injectable()
export class StoredProceduresService {
  constructor(private readonly connection: Connection) {}

  async spActiveRegionsByCode(code: string): Promise<Region[]> {
    return await this.connection.query(
      `CALL SP_ACTIVE_REGIONS_BY_CODE('${code}')`,
    );
  }
}
