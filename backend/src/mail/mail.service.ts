import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendBeforeLaunchDateTimeReminderEmail(
    emailTo: string,
    collectionName: string,
    time: string,
  ) {
    await this.mailerService.sendMail({
      to: emailTo,
      subject: 'Collection Reminder!',
      template: 'beforeLaunchDateTime',
      context: {
        collectionName,
        time,
      },
    });

    console.log(
      'MailService:sendBeforeLaunchDateTimeReminderEmail',
      'email sent',
      { emailTo, collectionName, time },
    );
  }

  async sendOnLaunchDateTimeReminderEmail(
    emailTo: string,
    collectionName: string,
  ) {
    await this.mailerService.sendMail({
      to: emailTo,
      subject: 'Collection Reminder!',
      template: 'onLaunchDateTime',
      context: {
        collectionName,
      },
    });

    console.log('MailService:sendOnLaunchDateTimeReminderEmail', 'email sent', {
      emailTo,
      collectionName,
    });
  }
}
