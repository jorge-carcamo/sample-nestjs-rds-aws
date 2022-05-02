import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountriesModule } from './countries/countries.module';
import { RegionsModule } from './regions/regions.module';
import { HealthController } from './health/health.controller';
import { DatabaseConfigService } from './config/database/database-config.service';
import { DatabaseConfigModule } from './config/database/database-config.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './commons/filters/http-exception.filter';
import { LoggingInterceptor } from './commons/interceptors/logging.interceptor';
import { AppConfigModule } from './config/app/app-config.module';
import { AppConfigService } from './config/app/app-config.service';
import { AppConfiguration } from './config/app/app-config.enum';

@Module({
  imports: [
    TerminusModule,
    AppConfigModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    TypeOrmModule.forRootAsync({
      imports: [DatabaseConfigModule],
      useExisting: DatabaseConfigService,
    }),
    CountriesModule,
    RegionsModule,
    AppModule,
  ],
  controllers: [HealthController],
  providers: [
    Logger,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {
  static port: number | string;

  constructor(private readonly _configService: AppConfigService) {
    AppModule.port = _configService.getAppConfig(AppConfiguration.PORT);
  }
}
