import { Injectable, LoggerService } from '@nestjs/common';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';

@Injectable()
export class LoggingConfigService {
  private transports: any;
  private readonly options: winston.LoggerOptions;
  private _logger: winston.Logger;

  private static _instance: LoggingConfigService;

  private constructor() {
    this.transports = {
      console: new winston.transports.Console({
        level: 'debug',
        format: winston.format.combine(
          winston.format.timestamp(),
          nestWinstonModuleUtilities.format.nestLike(),
        ),
      }),
      file: new winston.transports.File({
        filename: 'errors.log',
        level: 'error',
      }),
      http: new winston.transports.Http({
        level: 'error',
        format: winston.format.json(),
      }),
    };

    this.options = {
      // options (same as WinstonModule.forRoot() options)
      levels: winston.config.syslog.levels,
      transports: [
        this.transports.console,
        this.transports.file,
        this.transports.http,
      ],
    };

    this._logger = winston.createLogger({
      // options (same as WinstonModule.forRoot() options)
      //levels: winston.config.syslog.levels,
      transports: [
        this.transports.console,
        // this.transports.file
        // this.transports.http
      ],
    });

    // production logs
    if (process.env.NODE_ENV === 'production') {
      this._logger.add(this.transports.console);
    }
  }

  public static getInstance(): LoggingConfigService {
    if (!this._instance) {
      this._instance = new LoggingConfigService();
    }
    return this._instance;
  }

  getLogger(): LoggerService {
    return WinstonModule.createLogger(this._logger);
  }
}
