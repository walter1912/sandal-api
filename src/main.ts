import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './middlewares/all-exception.filter';

const host = process.env.HOST ?? 3011;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      // có thể custom các options validation ở trong này
      transform: true,
    }),
  );
  // setup swagger to test API
  const config = new DocumentBuilder()
    .setTitle('Sandal shop')
    .setDescription('The sandal API description')
    .setVersion('1.0')
    .addTag('sandals')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // exceptions
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(host);
}
bootstrap();
