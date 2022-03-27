import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { RemindersService } from './reminders.service';
import { Reminder } from './entities/reminder.entity';
import { CreateReminderInput } from './dto/create-reminder.input';
import { UpdateReminderInput } from './dto/update-reminder.input';
import { Collection } from 'src/collections/entities/collection.entity';

@Resolver(() => Reminder)
export class RemindersResolver {
  constructor(private readonly remindersService: RemindersService) {}

  @Mutation(() => Reminder)
  createReminder(
    @Args('createReminderInput') createReminderInput: CreateReminderInput,
  ) {
    return this.remindersService.create(createReminderInput);
  }

  @Query(() => [Reminder], { name: 'reminders' })
  findAll() {
    return this.remindersService.findAll();
  }

  @Query(() => Reminder, { name: 'reminder' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.remindersService.findOne(id);
  }

  @ResolveField((returns) => Collection)
  collection(@Parent() reminder: Reminder): Promise<Collection> {
    return this.remindersService.getCollection(reminder.collectionId);
  }

  @Mutation(() => Reminder)
  updateReminder(
    @Args('updateReminderInput') updateReminderInput: UpdateReminderInput,
  ) {
    return this.remindersService.update(
      updateReminderInput.id,
      updateReminderInput,
    );
  }

  @Mutation(() => Boolean)
  async removeReminder(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    const remove = await this.remindersService.remove(id);

    return Boolean(remove.affected);
  }
}
