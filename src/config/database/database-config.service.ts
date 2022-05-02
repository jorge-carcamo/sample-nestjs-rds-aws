import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { SecretConfigService } from '../secret/secret-config.service';
import DatabaseConfig from './database-config';
import SecretConfig from '../secret/secret-config';
import { DatabaseConfiguration } from './database-config.enum';
import { SecretConfiguration } from '../secret/secret-config.enum';

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  constructor(
    @Inject(DatabaseConfig.KEY)
    private databaseConfig: ConfigType<typeof DatabaseConfig>,
    @Inject(SecretConfig.KEY)
    private secretConfig: ConfigType<typeof SecretConfig>,
    private readonly secretConfigService: SecretConfigService,
  ) {}

  getDatabaseConfig(key: string) {
    return this.databaseConfig[key];
  }

  getSecretConfig(key: string) {
    return this.secretConfig[key];
  }

  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    return {
      type: 'mysql', // choose database type link: https://typeorm.io/#/connection-options
      host: await this.secretConfigService.getSecret(
        this.getSecretConfig(SecretConfiguration.SECRET_NAME),
        DatabaseConfiguration.HOST,
      ),
      port: parseInt(
        await this.secretConfigService.getSecret(
          this.getSecretConfig(SecretConfiguration.SECRET_NAME),
          DatabaseConfiguration.PORT,
        ),
        10,
      ),
      username: await this.secretConfigService.getSecret(
        this.getSecretConfig(SecretConfiguration.SECRET_NAME),
        DatabaseConfiguration.USERNAME,
      ),
      password: await this.secretConfigService.getSecret(
        this.getSecretConfig(SecretConfiguration.SECRET_NAME),
        DatabaseConfiguration.PASSWORD,
      ),
      database: await this.secretConfigService.getSecret(
        this.getSecretConfig(SecretConfiguration.SECRET_NAME),
        DatabaseConfiguration.DATABASE,
      ),
      entities: ['src/**/*{.entity.ts}'],
      autoLoadEntities:
        (await this.getDatabaseConfig(
          DatabaseConfiguration.AUTOLOAD_ENTITIES,
        )) === 'true',
      synchronize:
        (await this.getDatabaseConfig(DatabaseConfiguration.SYNCHRONIZE)) ===
        'true',
    };
  }
}
