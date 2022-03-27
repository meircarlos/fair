import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MailService } from 'src/mail/mail.service';
import { RemindersService } from '../reminders.service';

@Injectable()
export class RemindersMailScheduler {
  constructor(
    private readonly remindersService: RemindersService,
    private readonly mailService: MailService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE, {
    name: 'sendReminderEmails',
  })
  async sendReminderEmails() {
    const reminders = await this.remindersService.findAllToTrigger();

    for (const reminder of reminders) {
      const time = this.remindersService.getTimeUntilLaunch(reminder);

      if (time === '0') {
        await this.mailService.sendOnLaunchDateTimeReminderEmail(
          reminder.emailTo,
          reminder.collection.name,
        );
      } else {
        await this.mailService.sendBeforeLaunchDateTimeReminderEmail(
          reminder.emailTo,
          reminder.collection.name,
          time,
        );
      }

      await this.remindersService.setTrigger(reminder.id, true);
    }
  }
}
