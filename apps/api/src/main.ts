import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { setupSwagger } from './setup-swagger';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';
import * as passport from 'passport';
import * as requestIp from 'request-ip';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.use(requestIp.mw())

  app.enableCors({
    credentials: true, // Allow credentials (cookies, HTTP authentication) to be sent cross-origin
    origin: 'http://localhost:3000', // Whitelist specific origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify the allowed HTTP methods
    maxAge: 3600, // Configure the maximum age (in seconds) of the preflight request
  });

  const config: ConfigService = app.get(ConfigService); // install helmet
  const logger = app.get(Logger);

  app.useLogger(app.get(Logger));
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(passport.initialize()); // Initialize Passport

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const port = config.get('PORT');

  setupSwagger(app);

  await app.listen(port);

  logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
