import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = Number(configService.get<string>('PORT') ?? '3000');
  const corsOrigin = configService.get<string>('CORS_ORIGIN', 'http://localhost:3000');

  if (!Number.isInteger(port)) {
    throw new Error('PORT must be a valid integer');
  }

  app.use(cookieParser());
  app.enableCors({
    origin: corsOrigin,
    credentials: true
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,
    forbidNonWhitelisted:true,
    transform: true
  }));
  const config =new DocumentBuilder()
  .setTitle('Backend Flower Store')
  .setDescription('Backend for Flower Store')
  .setVersion("1.0")
  .addBearerAuth()
  .addTag('')
  .build();
  const document = SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(port);
}
bootstrap();
