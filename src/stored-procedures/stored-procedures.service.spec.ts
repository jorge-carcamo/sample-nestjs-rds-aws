import { Test, TestingModule } from '@nestjs/testing';
import { Region } from '../regions/entities/region.entity';
import { Connection } from 'typeorm';
import { Country } from '../countries/entities/country.entity';

import { StoredProceduresService } from './stored-procedures.service';

const oneCountry = new Country('Chile', 'CL', 'America/Santiago', 1);

const regionArray = [
  new Region(
    oneCountry,
    'MAU',
    'Region del Maule',
    -33.402247,
    -70.578249,
    1,
  ),
  new Region(
    oneCountry,
    'TAP',
    'Region de Tarapaca',
    -33.582017,
    -71.613681,
    1,
  ),
  new Region(
    oneCountry,
    'OHI',
    'Region de OHiggins',
    -33.482925,
    -70751396,
    0,
  ),
];

describe('StoredProceduresService', () => {
  let spService: StoredProceduresService;
  let connection: Connection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoredProceduresService,
        {
          provide: Connection,
          useValue: {
            query: jest.fn().mockResolvedValue(regionArray),
          },
        },
      ],
    }).compile();

    spService = module.get<StoredProceduresService>(StoredProceduresService);
    connection = module.get<Connection>(Connection);
  });

  it('should be defined', () => {
    expect(spService).toBeDefined();
  });

  describe('spActiveRegionsByCode', () => {
    it('should return an array of regions', async () => {
      const regions = await spService.spActiveRegionsByCode('any');
      expect(regions).toEqual(regionArray);
    });
  });
});
