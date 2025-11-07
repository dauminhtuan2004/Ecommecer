// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';  // Import Swagger
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, 
    forbidNonWhitelisted: true, 
    transform: true 
  }));

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('E-commerce API')  // Title docs
    .setDescription('API for clothing e-commerce backend')  // Description
    .setVersion('1.0')  // Version
    .addBearerAuth({  // Auth cho JWT
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    }, 'Authorization')  // Name cho global auth
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);  // Path: /api

  const logger = new Logger('Bootstrap');
  await app.listen(process.env.PORT || 3000);
  logger.log(`App running on http://localhost:${process.env.PORT || 3000}`);
  logger.log(`Swagger docs at http://localhost:${process.env.PORT || 3000}/api`);
}
bootstrap();