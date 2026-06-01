import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AllExecptionFilters } from './http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { httpAdapter } = app.get(HttpAdapterHost)
  app.useGlobalFilters(new AllExecptionFilters(httpAdapter))
  app.useGlobalPipes( new ValidationPipe({ whitelist:true, forbidNonWhitelisted: true })) // forbidnonwhitelisted throws an error if extra field is sent
  
  const configService = app.get(ConfigService);
  const PORT = configService.getOrThrow<number>('PORT');
  await app.listen(PORT, '0.0.0.0');
}
bootstrap();
