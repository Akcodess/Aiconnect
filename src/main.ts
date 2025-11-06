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

  // Swagger setup
  // const config = new DocumentBuilder()
  //   .setTitle(process.env.WIDE_PRIFIX!)
  //   .setVersion(process.env.VERSION!)
  //   .addTag(process.env.WIDE_PRIFIX!)
  //   .build();
  // const documentFactory = () => SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT!);
}
void bootstrap();
