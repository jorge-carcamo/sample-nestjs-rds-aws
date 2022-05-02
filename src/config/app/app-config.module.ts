import { Module } from '@nestjs/common';
import { AppConfigService } from './app-config.service';
import { ConfigModule } from '@nestjs/config';
import AppConfig from './app-config';

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      load: [AppConfig],
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
