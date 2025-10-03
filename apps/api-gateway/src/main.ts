import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

import { AppModule } from './modules/app/app.module';
import { proxyConfiguration } from './configs/proxy.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const port = configService.get<number>('PORT')!;
  const globalPrefix = 'api';

  app.setGlobalPrefix(globalPrefix);

  proxyConfiguration(app, globalPrefix);

  app.use(helmet());

  await app.listen(port, () => {
    Logger.log(`Gateway is running on: http://localhost:${port}/${globalPrefix}`,);
  });
}

bootstrap();
