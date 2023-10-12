import { Module } from '@nestjs/common';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { TagModule } from '@app/tags/tags.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './ormconfig';
import { UsersModule } from './users/users.module';

@Module({
  imports: [TypeOrmModule.forRoot(config), TagModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
