import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { Country } from './entities/country.entity';
import { CountriesService } from './countries.service';

const countryArray = [
  new Country('Chile', 'CL', 'America/Santiago', 1),
  new Country('Colombia', 'CO', 'America/Bogota', 0),
  new Country('Peru', 'PE', 'America/Lima', 0),
];

const oneCountry = new Country('Peru', 'PE', 'America/Lima', 0);

describe('CountriesService', () => {
  let countriesService: CountriesService;
  let countriesRepository: Repository<Country>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountriesService,
        {
          provide: getRepositoryToken(Country),
          useValue: {
            find: jest.fn().mockResolvedValue(countryArray),
            findOneOrFail: jest.fn().mockResolvedValue(oneCountry),
            create: jest.fn().mockReturnValue(oneCountry),
            save: jest.fn(),
            update: jest.fn().mockResolvedValue(true),
            delete: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    countriesService = module.get<CountriesService>(CountriesService);
    countriesRepository = module.get<Repository<Country>>(
      getRepositoryToken(Country),
    );
  });

  it('should be defined', () => {
    expect(countriesService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of countries', async () => {
      const countries = await countriesService.findAll();
      expect(countries).toEqual(countryArray);
    });
  });

  describe('findOne', () => {
    it('should get a single country', () => {
      const repoSpy = jest.spyOn(countriesRepository, 'findOneOrFail');
      expect(countriesService.findOne(1)).resolves.toEqual(oneCountry);
      expect(repoSpy).toBeCalledWith({ id: 1 });
    });
  });

  describe('create', () => {
    it('should successfully insert a country', () => {
      expect(countriesService.create(oneCountry)).resolves.toEqual(oneCountry);
      expect(countriesRepository.create).toBeCalledTimes(1);
      expect(countriesRepository.create).toBeCalledWith(oneCountry);
      expect(countriesRepository.save).toBeCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should call the update method', async () => {
      const country = await countriesService.update(1, oneCountry);
      expect(country).toEqual(oneCountry);
      expect(countriesRepository.update).toBeCalledTimes(1);
      expect(countriesRepository.update).toBeCalledWith({ id: 1 }, oneCountry);
    });
  });

  describe('remove', () => {
    it('should return {deleted: true}', () => {
      expect(countriesService.remove(1)).resolves.toEqual({ deleted: true });
    });
    it('should return {deleted: false, message: err.message}', () => {
      const repoSpy = jest
        .spyOn(countriesRepository, 'delete')
        .mockRejectedValueOnce(new Error('Bad Delete Method.'));
      expect(countriesService.remove(2)).resolves.toEqual({
        deleted: false,
        message: 'Bad Delete Method.',
      });
      expect(repoSpy).toBeCalledWith({ id: 2 });
      expect(repoSpy).toBeCalledTimes(1);
    });
  });
});
