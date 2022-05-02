import { Test, TestingModule } from '@nestjs/testing';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { Country } from './entities/country.entity';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';
import {
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';

const countryArray = [
  new Country('Chile', 'CL', 'America/Santiago', 1),
  new Country('Colombia', 'CO', 'America/Bogota', 0),
  new Country('Peru', 'PE', 'America/Lima', 0),
];

const oneCountry = new Country('Peru', 'PE', 'America/Lima', 0);

const httpExcepion = new HttpException(
  {
    message: 'error',
  },
  HttpStatus.NO_CONTENT,
);

const internalServerError = new InternalServerErrorException('error');

describe('CountriesController', () => {
  let countriesController: CountriesController;
  let countriesService: CountriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountriesController],
      providers: [
        {
          provide: CountriesService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(countryArray),
            findOne: jest
              .fn()
              .mockImplementation((id: number) => Promise.resolve(oneCountry)),
            create: jest
              .fn()
              .mockImplementation((country: CreateCountryDto) =>
                Promise.resolve({ id: 1, ...oneCountry }),
              ),
            update: jest
              .fn()
              .mockImplementation((country: UpdateCountryDto) =>
                Promise.resolve({ id: 1, ...oneCountry }),
              ),
            remove: jest.fn().mockResolvedValue({ deleted: true }),
          },
        },
      ],
    }).compile();

    countriesController = module.get<CountriesController>(CountriesController);
    countriesService = module.get<CountriesService>(CountriesService);
  });

  it('should be defined', () => {
    expect(countriesController).toBeDefined();
  });

  describe('findAll', () => {
    it('should get an array of countries', async () => {
      await expect(countriesController.findAll()).resolves.toEqual(
        countryArray,
      );
    });
  });

  describe('findOne', () => {
    it('should get a single country', async () => {
      await expect(countriesController.findOne(1)).resolves.toEqual(oneCountry);
      await expect(countriesController.findOne(2)).resolves.toEqual(oneCountry);
    });
  });

  describe('findOneException', () => {
    it('should get a Exception', async () => {
      jest.spyOn(countriesService, 'findOne').mockRejectedValue(httpExcepion);
      await expect(countriesController.findOne(1)).rejects.toEqual(
        httpExcepion,
      );
    });
  });

  describe('create', () => {
    it('should create a new country', async () => {
      const newCountryDTO: CreateCountryDto = oneCountry;
      await expect(countriesController.create(newCountryDTO)).resolves.toEqual({
        id: 1,
        ...oneCountry,
      });
    });
  });

  describe('createError', () => {
    it('should get a Error', async () => {
      const newCountryDTO: CreateCountryDto = oneCountry;
      jest
        .spyOn(countriesService, 'create')
        .mockRejectedValue(internalServerError);
      await expect(countriesController.create(newCountryDTO)).rejects.toEqual(
        internalServerError,
      );
    });
  });

  describe('update', () => {
    it('should update a new country', async () => {
      const updCountryDTO: UpdateCountryDto = oneCountry;
      await expect(
        countriesController.update(1, updCountryDTO),
      ).resolves.toEqual({
        id: 1,
        ...oneCountry,
      });
    });
  });

  describe('updateError', () => {
    it('should get a Error', async () => {
      const updCountryDTO: UpdateCountryDto = oneCountry;
      jest
        .spyOn(countriesService, 'update')
        .mockRejectedValue(internalServerError);
      await expect(
        countriesController.update(1, updCountryDTO),
      ).rejects.toEqual(internalServerError);
    });
  });

  describe('remove', () => {
    it('should return that it deleted a country', async () => {
      await expect(countriesController.remove(1)).resolves.toEqual({
        deleted: true,
      });
    });
    it('should return that it did not delete a country', async () => {
      const deleteSpy = jest
        .spyOn(countriesService, 'remove')
        .mockResolvedValueOnce({ deleted: false });
      await expect(countriesController.remove(2)).resolves.toEqual({
        deleted: false,
      });
    });
  });

  describe('removeError', () => {
    it('should get a Error', async () => {
      jest
        .spyOn(countriesService, 'remove')
        .mockRejectedValue(internalServerError);
      await expect(countriesController.remove(2)).rejects.toEqual(
        internalServerError,
      );
    });
  });
});
