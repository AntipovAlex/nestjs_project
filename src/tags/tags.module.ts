import { Module } from '@nestjs/common';
import { TagsController } from '@app/tags/tags.controller';
import { TagsService } from '@app/tags/tags.service';

@Module({
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagModule {}
