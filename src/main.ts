import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';

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
  app.setGlobalPrefix('v1');
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, { autoTagControllers: true });
  SwaggerModule.setup('api', app, documentFactory, {
    swaggerOptions: {
      tagsSorter: (a: string, b: string) => a.localeCompare(b),

      operationsSorter: (a, b) => {
        const methodOrder = { get: 1, post: 2, patch: 3, put: 4, delete: 5 };
        return (
          (methodOrder[a.get('method')] || 99) -
          (methodOrder[b.get('method')] || 99)
        );
      },
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
