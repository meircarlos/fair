import { forwardRef, Module } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { RemindersResolver } from './reminders.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reminder } from './entities/reminder.entity';
import { CollectionsModule } from 'src/collections/collections.module';
import { RemindersMailScheduler } from './mail-scheduler/reminders-mail-scheduler.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reminder]),
    forwardRef(() => CollectionsModule),
  ],
  providers: [RemindersResolver, RemindersMailScheduler, RemindersService],
  exports: [RemindersService],
})
export class RemindersModule {}
