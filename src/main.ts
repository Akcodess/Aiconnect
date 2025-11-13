import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import * as http from 'http';
import * as https from 'https';
import * as fs from 'fs';
import { AppModule } from './app.module';
import path from 'path';
import { ValidationPipe, VersioningType } from '@nestjs/common';

import { ResponseExceptionFilter } from './common/filters/response-exception.filter';
async function bootstrap() {
  // Create a single Express instance to serve both HTTP and HTTPS
  const server = express();
  const adapter = new ExpressAdapter(server);

  const app = await NestFactory.create(AppModule, adapter);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
    })
  );
  app.useGlobalFilters(new ResponseExceptionFilter());
  // Enable CORS for all routes
  app.enableCors();

  // Serve static files
  app.use(`/${process.env.AICONNECT_V}/v${process.env.API_VERSION}/${process.env.ACCESS_FILEUPLODA_PATH}`, express.static(path.join(process.cwd(), `src/${process.env.ACCESS_FILEUPLODA_PATH!}`)));

  // Set global prefix and enable URI versioning so routes are served under /aiconnect/v1 and /aiconnect/v2
  app.setGlobalPrefix(process.env.AICONNECT_V!);
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: process.env.API_VERSION ?? '1' });

  // Initialize the Nest app without binding a single port
  await app.init();

  // Start HTTP server
  http.createServer(server).listen(Number(process.env.PORT!));

  // Start HTTPS server
  const sslOptions = { key: fs.readFileSync(process.env.SERVER_KEY!), cert: fs.readFileSync(process.env.SERVER_CRT!) };
  https.createServer(sslOptions, server).listen(Number(process.env.PORTSSL!));
}
void bootstrap();