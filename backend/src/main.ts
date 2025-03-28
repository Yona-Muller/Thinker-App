import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './utils/error-handling';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function waitForEnvVars(): Promise<void> {
  const requiredEnvVars = ['DB_HOST'];
  const missing = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missing.length > 0) {
    console.log(`Missing environment variables: ${missing.join(', ')}. Waiting for them to be set...`);

    let maxRetries = 5;
    let retryCount = 0;

    while (missing.some((envVar) => !process.env[envVar]) && retryCount < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      retryCount++;
      console.log(`Retry ${retryCount}/${maxRetries} checking for environment variables...`);
    }

    const stillMissing = requiredEnvVars.filter((envVar) => !process.env[envVar]);
    if (stillMissing.length > 0) {
      console.warn(`Warning: Some required environment variables are still missing: ${stillMissing.join(', ')}. The application may not function properly.`);
    }
  }
}

async function bootstrap() {
  await waitForEnvVars();

  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const server = app.getHttpServer();
  const router = server._events.request._router;

  logger.log('NODE_ENV:', process.env.NODE_ENV);
  logger.log(`Selected log level: ${process.env.LOG_LEVEL}`);
  app.useLogger(logger);

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  app.use(cookieParser());

  const config = new DocumentBuilder().setTitle('Thinker API').setDescription('The Thinker API description').setVersion('1.0').addTag('auth').addBearerAuth().build();
  const document = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: ['https://localhost:5173', 'https://thinker-admin.duckdns.org'],
    credentials: true,
  });

  await app.listen(3000, '0.0.0.0');

  logger.log('Available routes:');
  router.stack.forEach((route) => {
    if (route.route) {
      logger.log(`${route.route.stack[0].method.toUpperCase()} ${route.route.path}`);
    }
  });
}

bootstrap();
