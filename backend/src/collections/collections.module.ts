import { forwardRef, Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsResolver } from './collections.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from './entities/collection.entity';
import { CollectionRemindersResolver } from './collection-reminders.resolver';
import { CollectionRemindersService } from './collection-reminders.service';
import { RemindersModule } from 'src/reminders/reminders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Collection]),
    forwardRef(() => RemindersModule),
  ],
  providers: [
    CollectionsResolver,
    CollectionsService,
    CollectionRemindersResolver,
    CollectionRemindersService,
  ],
  exports: [CollectionsService],
})
export class CollectionsModule {}
