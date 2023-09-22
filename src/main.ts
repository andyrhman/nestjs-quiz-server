import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Using api as the global url --> http://localhost:5000/api
  app.setGlobalPrefix('api');

  // Adding this for the class validator
  app.useGlobalPipes(new ValidationPipe());

  // Using cookie parser for jwt
  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true //passing cookie back and forth in every request remove {passtrough: true}
  });

  await app.listen(8000);
}
bootstrap();