import { Controller, Get } from '@nestjs/common';
import { TagsService } from '@app/tags/tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}
  @Get()
  getAll(): Array<string> {
    return this.tagsService.getAll();
  }
}
