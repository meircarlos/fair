import { Inject, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import Agenda from 'src/agenda';

const agenda = Agenda.getAgenda();

@Injectable()
export class CollectionsService {
  async setReminders(
    collectionId: string,
    collectionName: string,
    reminders: string[],
    launchDate: string,
    emailTo: string,
  ) {
    await this.deletePreviousReminders(collectionId);

    await this.setNewReminders(
      collectionId,
      collectionName,
      reminders,
      launchDate,
      emailTo,
    );

    return true;
  }

  async deletePreviousReminders(collectionId: string) {
    const canceledJobs = await agenda.cancel({
      data: { collectionId: collectionId },
    });

    return canceledJobs;
  }

  private async setNewReminders(
    collectionId: string,
    collectionName: string,
    reminders: string[],
    launchDate: string,
    emailTo: string,
  ) {
    const launchDateJS = dayjs(launchDate);

    // Sets launch reminder emails jobs
    for (const timeUntilLaunch of reminders) {
      const reminderDate = this.getReminderDate(launchDateJS, timeUntilLaunch);

      await agenda.schedule(reminderDate, 'launch reminder email', {
        collectionId,
        collectionName,
        timeUntilLaunch,
        launchDate,
        emailTo,
      });
    }

    // Sets launch date email job
    await agenda.schedule(launchDateJS.toDate(), 'launch date email', {
      collectionId,
      collectionName,
      launchDate,
      emailTo,
    });
  }

  private async getReminderDate(
    launchDateJS: dayjs.Dayjs,
    timeUntilLaunch: string,
  ): Promise<Date> {
    switch (timeUntilLaunch) {
      case '30m':
        return launchDateJS.subtract(30, 'minute').toDate();

      case '1h':
        return launchDateJS.subtract(1, 'hour').toDate();

      default: // '1d'
        return launchDateJS.subtract(1, 'day').toDate();
    }
  }
}
