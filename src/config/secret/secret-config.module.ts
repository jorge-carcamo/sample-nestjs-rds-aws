import { Module } from '@nestjs/common';
import { SecretConfigService } from './secret-config.service';
import { ConfigModule } from '@nestjs/config';
import SecretConfig from './secret-config';

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      load: [SecretConfig],
    }),
  ],
  providers: [SecretConfigService],
  exports: [SecretConfigService],
})
export class SecretConfigModule {}
