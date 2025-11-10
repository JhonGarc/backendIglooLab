import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true, 
      transform: true, 
    }),
  );

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('API Farmacéutica')
    .setDescription('API para la gestión de productos farmacéuticos')
    .setVersion('1.0')
    .addTag('products')
    .addTag('auth') 
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`Servidor corriendo en: http://localhost:${port}`);
  console.log(`Swagger disponible en: http://localhost:${port}/api/docs`);
}

bootstrap();
