import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true
  });

  // הסר את זה אם קיים
  // app.setGlobalPrefix('api');

  await app.listen(4000, '0.0.0.0');
  
  // הדפס את כל הנתיבים הזמינים
  const server = app.getHttpServer();
  const router = server._events.request._router;
  
  logger.log('Available routes:');
  router.stack.forEach(route => {
    if (route.route) {
      logger.log(`${route.route.stack[0].method.toUpperCase()} ${route.route.path}`);
    }
  });
}
bootstrap();