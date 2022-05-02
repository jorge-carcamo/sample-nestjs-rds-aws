import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SecretConfigService } from '../secret/secret-config.service';
import { DatabaseConfigService } from './database-config.service';
import DatabaseConfig from './database-config';
import SecretConfig from '../secret/secret-config';

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      load: [DatabaseConfig, SecretConfig],
    }),
  ],
  providers: [DatabaseConfigService, SecretConfigService],
  exports: [DatabaseConfigService],
})
export class DatabaseConfigModule {}
