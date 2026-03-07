import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const db = drizzle(process.env.DATABASE_URL!);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('API Documentation Kaos Kaki Management')
    .setDescription('backend untuk app kaos kaki management')
    .setVersion('1.0')
    .addTag('kaos kaki management')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
