import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  
  // הגדרת CORS
  app.enableCors({
    origin: true, // או הגדר ספציפית: ['http://localhost:19006', 'exp://192.168.1.21:8081']
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true
  });

  // הדפס את כל הנתיבים הזמינים לפני הגדרת ה-prefix
  logger.log('Routes before prefix:');
  const serverBefore = app.getHttpServer();
  const routerBefore = serverBefore?._events?.request?._router;
  routerBefore?.stack.forEach(route => {
    if (route.route) {
      logger.log(`${route.route.stack[0].method.toUpperCase()} ${route.route.path}`);
    }
  });

  // הגדר את ה-prefix
  app.setGlobalPrefix('api');

  // הדפס את כל הנתיבים הזמינים אחרי הגדרת ה-prefix
  logger.log('Routes after prefix:');
  const serverAfter = app.getHttpServer();
  const routerAfter = serverAfter?._events?.request?._router;
  routerAfter?.stack.forEach(route => {
    if (route.route) {
      logger.log(`${route.route.stack[0].method.toUpperCase()} ${route.route.path}`);
    }
  });

  await app.listen(4000, '0.0.0.0');
  logger.log(`Application is running on: http://0.0.0.0:4000`);
}
bootstrap();