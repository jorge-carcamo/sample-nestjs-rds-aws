import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './commons/interceptors/logging.interceptor';
import { LoggingConfigService } from './config/logging/logging-config.service';

async function bootstrap() {
  const logger = LoggingConfigService.getInstance().getLogger();
  const app = await NestFactory.create(AppModule, {
    logger: logger,
  });

  app.useGlobalInterceptors(new LoggingInterceptor(logger));
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('sample-nestjs-rds-aws')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
