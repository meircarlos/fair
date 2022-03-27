import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { CollectionsService } from 'src/collections/collections.service';
import { Collection } from 'src/collections/entities/collection.entity';
import { LessThanOrEqual, Repository } from 'typeorm';
import { CreateReminderInput } from './dto/create-reminder.input';
import { UpdateReminderInput } from './dto/update-reminder.input';
import { Reminder } from './entities/reminder.entity';

@Injectable()
export class RemindersService {
  constructor(
    @InjectRepository(Reminder)
    private remindersRepository: Repository<Reminder>,
    @Inject(forwardRef(() => CollectionsService))
    private collectionsService: CollectionsService,
  ) {}

  create(createReminderInput: CreateReminderInput): Promise<Reminder> {
    const newReminder = this.remindersRepository.create(createReminderInput);

    return this.remindersRepository.save(newReminder);
  }

  findAll(): Promise<Reminder[]> {
    return this.remindersRepository.find();
  }

  findOne(id: number): Promise<Reminder> {
    return this.remindersRepository.findOneOrFail(id);
  }

  findAllToTrigger() {
    const now = dayjs().format();

    return this.remindersRepository.find({
      where: {
        dateTime: LessThanOrEqual(now),
        triggered: false,
      },
      relations: ['collection'],
    });
  }

  getCollection(collectionId: number): Promise<Collection> {
    return this.collectionsService.findOne(collectionId);
  }

  getOneNonTriggeredReminderFromCollection(
    collectionId: number,
  ): Promise<Reminder> {
    return this.remindersRepository.findOne({
      where: {
        collectionId,
        triggered: false,
      },
    });
  }

  async update(
    id: number,
    updateReminderInput: UpdateReminderInput,
  ): Promise<Reminder> {
    const reminder = await this.remindersRepository.preload({
      id,
      ...updateReminderInput,
    });

    return this.remindersRepository.save(reminder);
  }

  setTrigger(id: number, value: boolean) {
    return this.remindersRepository.update(id, {
      triggered: value,
    });
  }

  remove(id: number) {
    return this.remindersRepository.delete(id);
  }

  removeNonTriggeredRemindersFromCollection(collectionId: number) {
    return this.remindersRepository.delete({
      collectionId,
      triggered: false,
    });
  }

  getTimeUntilLaunch(reminder: Reminder): string {
    const launchDate = dayjs(reminder.collection.launchDate);
    const reminderDate = dayjs(reminder.dateTime);

    const time = launchDate.diff(reminderDate, 'minute');

    switch (time) {
      case 0:
        return '0';

      case 30:
        return '30 mins';

      case 60:
        return '1h';

      // CAREFUL: the default is 1 day
      default:
        // case 60 * 60:
        return '1 day';
    }
  }
}
