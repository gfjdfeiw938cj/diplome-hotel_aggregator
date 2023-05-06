import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv' 
dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });
 
  app.enableCors({
    origin: process.env.URL_FRONTEND,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
 
  app.use(
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3600000 },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(cookieParser());

  await app.listen(3000);
}
bootstrap();
