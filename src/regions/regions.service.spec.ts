import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Country } from '../countries/entities/country.entity';
import { Repository } from 'typeorm';
import { Region } from './entities/region.entity';
import { RegionsService } from './regions.service';

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

const oneRegion = new Region(
  oneCountry,
  'MAU',
  'Region del Maule',
  -33.402247,
  -70.578249,
  1,
);

describe('RegionsService', () => {
  let regionsService: RegionsService;
  let regionsRepository: Repository<Region>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegionsService,
        {
          provide: getRepositoryToken(Region),
          useValue: {
            find: jest.fn().mockResolvedValue(regionArray),
            findOneOrFail: jest.fn().mockResolvedValue(oneRegion),
          },
        },
      ],
    }).compile();

    regionsService = module.get<RegionsService>(RegionsService);
    regionsRepository = module.get<Repository<Region>>(getRepositoryToken(Region));
  });

  it('should be defined', () => {
    expect(regionsService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of regions', async () => {
      const regions = await regionsService.findAll();
      expect(regions).toEqual(regionArray);
    });
  });

  describe('findOne', () => {
    it('should get a single region', () => {
      const repoSpy = jest.spyOn(regionsRepository, 'findOneOrFail');
      expect(regionsService.findOne(1)).resolves.toEqual(oneRegion);
      expect(repoSpy).toBeCalledWith({ id: 1 });
    });
  });
});
