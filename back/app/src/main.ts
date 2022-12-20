import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestInterceptor } from '@nestjs/common';
import {ExecutionContext, CallHandler, Injectable} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Response } from 'express';

@Injectable()
export class VersionHeaderInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // When the request is HTTP
    // if (context.getType() === 'http') {
    const http = context.switchToHttp();
      const response: Response = http.getResponse();
      response.setHeader('Access-Control-Allow-Origin', "http://localhost:3000");
    // }
    return next.handle();
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new VersionHeaderInterceptor());
  app.enableCors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["cookie", "Cookie", "authorization", "Authorization", "content-type"],
    exposedHeaders: ["cookie", "Cookie", "authorization", "Authorization", "content-type"],
  });

  app.enableCors({});
  const config = new DocumentBuilder()
    .setTitle('Median')
    .setDescription('The Median API description')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3001);
}
bootstrap();