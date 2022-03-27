import { forwardRef, Inject, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { Reminder } from 'src/reminders/entities/reminder.entity';
import { RemindersService } from 'src/reminders/reminders.service';
import { CollectionsService } from './collections.service';

const MINUTES_IN_HALF_AN_HOUR = 30;
const MINUTES_IN_ONE_HOUR = 60;
const HOURS_IN_ONE_DAY = 24;
const MINUTES_IN_ONE_DAY = HOURS_IN_ONE_DAY * MINUTES_IN_ONE_HOUR;

const BEFORE_LAUNCH_DATE_TIME_REMINDERS_MINUTES = [
  -MINUTES_IN_HALF_AN_HOUR,
  -MINUTES_IN_ONE_HOUR,
  -MINUTES_IN_ONE_DAY,
];

@Injectable()
export class CollectionRemindersService {
  constructor(
    @Inject(forwardRef(() => CollectionsService))
    private collectionsService: CollectionsService,
    private remindersService: RemindersService,
  ) {}

  async removeNonTriggeredRemindersFromCollection(collectionId: number) {
    await this.remindersService.removeNonTriggeredRemindersFromCollection(
      collectionId,
    );
  }

  async replaceReminders(collectionId: number): Promise<Reminder[]> {
    const nonTriggeredReminder =
      await this.remindersService.getOneNonTriggeredReminderFromCollection(
        collectionId,
      );

    if (!nonTriggeredReminder) {
      const message =
        'cannot replace reminders of a collection without any non triggered reminders';
      console.log(
        'error:CollectionRemindersService:replaceReminders',
        message,
        {
          collectionId,
        },
      );
      throw new Error(message);
    }

    return this.setUpReminders(collectionId, nonTriggeredReminder.emailTo);
  }

  async setUpReminders(
    collectionId: number,
    emailTo: string,
  ): Promise<Reminder[]> {
    const collection = await this.collectionsService.findOne(collectionId);

    if (!collection.launchDate) {
      return [];
    }

    if (collection.reminders) {
      await this.removeNonTriggeredRemindersFromCollection(collection.id);
    }

    const reminders = await this.setReminders(
      collection.id,
      collection.launchDate,
      emailTo,
    );

    return reminders;
  }

  async setReminders(
    collectionId: number,
    collectionLaunchDate: Date,
    emailTo: string,
  ): Promise<Reminder[]> {
    const beforeLaunchDateTimeReminders =
      await this.setBeforeLaunchDateTimeReminders(
        collectionId,
        collectionLaunchDate,
        emailTo,
      );
    const onLaunchDateTimeReminder = await this.setOnLaunchDateTimeReminder(
      collectionId,
      collectionLaunchDate,
      emailTo,
    );

    const reminders = [
      ...beforeLaunchDateTimeReminders,
      onLaunchDateTimeReminder,
    ];

    return reminders;
  }

  private async setBeforeLaunchDateTimeReminders(
    collectionId: number,
    collectionLaunchDate: Date,
    emailTo: string,
  ): Promise<Reminder[]> {
    const launchDate = dayjs(collectionLaunchDate);

    const remindersDateTimes = BEFORE_LAUNCH_DATE_TIME_REMINDERS_MINUTES.map(
      (minutes) => launchDate.add(minutes, 'minute'),
    );

    const reminders = [];
    for (const reminderDateTime of remindersDateTimes) {
      const reminder = await this.remindersService.create({
        collectionId,
        dateTime: reminderDateTime.toDate(),
        emailTo,
      });

      reminders.push(reminder);
    }

    return reminders;
  }

  private async setOnLaunchDateTimeReminder(
    collectionId: number,
    collectionLaunchDate: Date,
    emailTo: string,
  ): Promise<Reminder> {
    const reminder = await this.remindersService.create({
      collectionId,
      dateTime: collectionLaunchDate,
      emailTo,
    });

    return reminder;
  }
}
