import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import AppConfig from './app-config';

@Injectable()
export class AppConfigService {
  constructor(
    @Inject(AppConfig.KEY)
    private appConfig: ConfigType<typeof AppConfig>,
  ) {}

  getAppConfig(key: string) {
    return this.appConfig[key];
  }
}
