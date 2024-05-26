import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { generateOpenApi } from '@ts-rest/open-api';
import { contract } from 'ts-contract';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Employee Management API')
    .setDescription(
      'This API is used to manage employees in a company. It allows you to create, read, update, and delete employees.',
    )
    .setVersion('1.0.0')
    .build();

  const document = generateOpenApi(contract, options);

  SwaggerModule.setup('docs', app, document);
  app.enableCors();
  await app.listen(3535);
}

bootstrap();
