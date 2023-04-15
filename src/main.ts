import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setTitle('DATN')
    .setDescription('The DATN API description')
    .setVersion('1.0')
    // .addServer('/centalki-staging/us-central1/api')
    .addTag('DATN')
    .addBearerAuth({
      name: 'Authorization',
      bearerFormat: 'Bearer',
      scheme: 'Bearer',
      type: 'http',
      in: 'Header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const swaggerCustomOptions: SwaggerCustomOptions = {
    swaggerOptions: { displayRequestDuration: true },
  };
  SwaggerModule.setup('api-docs', app, document, swaggerCustomOptions);
  app.enableCors();
  await app.listen(5000);
}
bootstrap();
