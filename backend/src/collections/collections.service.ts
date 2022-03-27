import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { Reminder } from 'src/reminders/entities/reminder.entity';
import { LessThanOrEqual, Repository } from 'typeorm';
import { CollectionRemindersService } from './collection-reminders.service';
import { CreateCollectionInput } from './dto/create-collection.input';
import { UpdateCollectionInput } from './dto/update-collection.input';
import { Collection } from './entities/collection.entity';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection)
    private collectionsRepository: Repository<Collection>,
    @Inject(forwardRef(() => CollectionRemindersService))
    private collectionRemindersService: CollectionRemindersService,
  ) {}

  create(createCollectionInput: CreateCollectionInput): Promise<Collection> {
    const newCollection = this.collectionsRepository.create(
      createCollectionInput,
    );

    return this.collectionsRepository.save(newCollection);
  }

  findAll(): Promise<Collection[]> {
    return this.collectionsRepository.find();
  }

  findAllLaunched() {
    const now = dayjs().format();

    return this.collectionsRepository.find({
      where: {
        launchDate: LessThanOrEqual(now),
      },
    });
  }

  findOne(id: number): Promise<Collection> {
    return this.collectionsRepository.findOneOrFail(id);
  }

  async update(
    id: number,
    updateCollectionInput: UpdateCollectionInput,
  ): Promise<Collection> {
    let collection = await this.collectionsRepository.preload({
      id,
      ...updateCollectionInput,
    });

    if (collection.launchDate && collection.reminders?.length > 0) {
      await this.collectionRemindersService.removeNonTriggeredRemindersFromCollection(
        collection.id,
      );
    }

    collection = await this.collectionsRepository.save(collection);

    return collection;
  }

  remove(id: number) {
    return this.collectionsRepository.delete(id);
  }
}
