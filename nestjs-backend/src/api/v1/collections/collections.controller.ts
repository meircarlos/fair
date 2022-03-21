import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { CollectionsService } from './collections.service';

@Controller('/collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post('/:collectionId')
  async setReminders(
    @Param('collectionId') collectionId: string,
    @Body('collectionName') collectionName: string,
    @Body('reminders') reminders: string[],
    @Body('launchDate') launchDate: string,
    @Body('emailTo') emailTo: string,
  ): Promise<boolean> {
    await this.collectionsService.setReminders(
      collectionId,
      collectionName,
      reminders,
      launchDate,
      emailTo,
    );

    return true;
  }

  @Delete('/:collectionId')
  async deleteReminders(
    @Param('collectionId') collectionId: string,
  ): Promise<boolean> {
    await this.collectionsService.deletePreviousReminders(collectionId);

    return true;
  }
}
