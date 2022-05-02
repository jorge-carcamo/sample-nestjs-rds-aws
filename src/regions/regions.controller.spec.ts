import { Test, TestingModule } from '@nestjs/testing';
import { StoredProceduresService } from '../stored-procedures/stored-procedures.service';
import { Country } from '../countries/entities/country.entity';
import { Region } from './entities/region.entity';
import { RegionsController } from './regions.controller';
import { RegionsService } from './regions.service';
import { HttpException, HttpStatus } from '@nestjs/common';

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

const t = new HttpException(
  {
    message: 'error',
  },
  HttpStatus.NO_CONTENT,
);

describe('RegionsController', () => {
  let regionsController: RegionsController;
  let regionsService: RegionsService;
  let sp: StoredProceduresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegionsController],
      providers: [
        {
          provide: StoredProceduresService,
          useValue: {
            spActiveRegionsByCode: jest.fn().mockResolvedValue([regionArray]),
          },
        },
        {
          provide: RegionsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(regionArray),
            findOne: jest
              .fn()
              .mockImplementation((id: number) => Promise.resolve(oneRegion)),
          },
        },
      ],
    }).compile();

    regionsController = module.get<RegionsController>(RegionsController);
    regionsService = module.get<RegionsService>(RegionsService);
    sp = module.get<StoredProceduresService>(StoredProceduresService);
  });

  it('should be defined', () => {
    expect(regionsController).toBeDefined();
  });

  describe('findActiveByCode', () => {
    it('should get an array of regions', async () => {
      await expect(regionsController.findActiveByCode('any')).resolves.toEqual(
        regionArray,
      );
    });
  });

  describe('findAll', () => {
    it('should get an array of regions', async () => {
      await expect(regionsController.findAll()).resolves.toEqual(regionArray);
    });
  });

  describe('findOne', () => {
    it('should get a single region', async () => {
      await expect(regionsController.findOne(1)).resolves.toEqual(oneRegion);
      await expect(regionsController.findOne(2)).resolves.toEqual(oneRegion);
    });
  });

  describe('findOneException', () => {
    it('should get a Exception', async () => {
      jest.spyOn(regionsService, 'findOne').mockRejectedValue(t);
      await expect(regionsController.findOne(1)).rejects.toEqual(t);
    });
  });
});
