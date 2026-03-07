import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const db = drizzle(process.env.DATABASE_URL!);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });

  const config = new DocumentBuilder()
    .setTitle('API Documentation Kaos Kaki Management')
    .setDescription('Backend untuk App kaos Kaki Management')
    .setVersion('1.0')
    .addTag('Kaos Kaki Management Routes')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
