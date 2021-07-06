import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  const port = parseInt(process.env.LISTEN_PORT);
  await app.listen(port);

  Logger.log(
    `Nest application listening on ${await app.getUrl()}`,
    'NestApplication',
  );
}
bootstrap();
