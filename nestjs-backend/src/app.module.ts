import { Module } from '@nestjs/common';
import { CollectionsController } from './api/v1/collections/collections.controller';
import { CollectionsService } from './api/v1/collections/collections.service';

@Module({
  imports: [],
  controllers: [CollectionsController],
  providers: [CollectionsService],
})
export class AppModule {}
