import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { env } from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Soursemates example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description:
          "You need to paste a Firebase Auth ID token for the authenticated user. In order to get it, please refer to the repositorys' Readme file",
        type: 'http',
      },
      'idToken',
    )
    .addTag('Soursemates')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(env.APP_PORT || 3000);
}
bootstrap();
