import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { generateOpenApi } from '@ts-rest/open-api';
import { contract } from 'ts-contract';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Fullstack Assessment API')
    .setDescription(
      'API documentation for the Fullstack Assessment application',
    )
    .setVersion('1.0.0')
    .build();

  const document = generateOpenApi(contract, options);

  SwaggerModule.setup('docs', app, document);
  app.enableCors();
  await app.listen(3535);
}

bootstrap();
