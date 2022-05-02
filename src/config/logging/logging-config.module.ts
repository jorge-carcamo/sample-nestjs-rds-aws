import { Module } from '@nestjs/common';
import { LoggingConfigService } from './logging-config.service';

/**
 * Import and provide app configuration related classes.
 *
 * @module
 */
@Module({
  exports: [LoggingConfigService],
})
export class LoggingConfigModule {}
