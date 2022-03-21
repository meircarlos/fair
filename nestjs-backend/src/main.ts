import { NestFactory } from '@nestjs/core';
import './config';
import { AppModule } from './app.module';
import emailService from './email.service';
import Agenda from './agenda';

async function bootstrap() {
  const emailTransporter = await emailService.getTransporter();
  await Agenda.bootstrap(emailTransporter);

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
