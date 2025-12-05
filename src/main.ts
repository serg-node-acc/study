import {NestFactory, Reflector} from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {JwtService} from "@nestjs/jwt";
import {AuthGuard} from "./guards/auth.guard";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  app.useGlobalGuards(new AuthGuard(app.get(JwtService), app.get(Reflector)));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.enableCors({
    credentials: true,
    origin: config.getOrThrow('ALLOWED_ORIGIN'),
  });

  const swgConfig = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The magazine API description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, swgConfig);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(config.getOrThrow<string>('APPLICATION_PORT'));
}
bootstrap();
