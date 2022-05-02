import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorResult,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm/connection/Connection';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
    private memoryHealthIndicator: MemoryHealthIndicator,
    @InjectConnection()
    private defaultConnection: Connection,
  ) {}

  @Get()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.health.check([
      async () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
    ]);
  }

  @Get('db')
  @HealthCheck()
  checkDatabase(): Promise<HealthCheckResult> {
    return this.health.check([
      async (): Promise<HealthIndicatorResult> =>
        this.db.pingCheck('database', { connection: this.defaultConnection }),
    ]);
  }

  @Get('memory')
  @HealthCheck()
  checkMemory(): Promise<HealthCheckResult> {
    return this.health.check([
      async (): Promise<HealthIndicatorResult> =>
        this.memoryHealthIndicator.checkRSS('memory_heap', 150 * 1024 * 1024),
    ]);
  }
}
