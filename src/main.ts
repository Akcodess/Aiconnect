import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseExceptionFilter } from './common/filters/response-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
    })
  );
  app.useGlobalFilters(new ResponseExceptionFilter());
  // Enable CORS for all routes
  app.enableCors();
  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
