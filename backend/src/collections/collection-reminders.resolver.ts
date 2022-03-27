import { Resolver, Mutation, Args, Int } from '@nestjs/graphql';
import { Reminder } from 'src/reminders/entities/reminder.entity';
import { CollectionRemindersService } from './collection-reminders.service';

@Resolver()
export class CollectionRemindersResolver {
  constructor(
    private readonly collectionRemindersService: CollectionRemindersService,
  ) {}

  @Mutation(() => [Reminder])
  setReminders(
    @Args('collectionId', { type: () => Int }) collectionId: number,
    @Args('emailTo') emailTo: string,
  ): Promise<Reminder[]> {
    return this.collectionRemindersService.setUpReminders(
      collectionId,
      emailTo,
    );
  }

  @Mutation(() => [Reminder])
  replaceReminders(
    @Args('collectionId', { type: () => Int }) collectionId: number,
  ): Promise<Reminder[]> {
    return this.collectionRemindersService.replaceReminders(collectionId);
  }

  @Mutation(() => Boolean)
  async cancelReminders(
    @Args('collectionId', { type: () => Int }) collectionId: number,
  ): Promise<boolean> {
    await this.collectionRemindersService.removeNonTriggeredRemindersFromCollection(
      collectionId,
    );

    return true;
  }
}
