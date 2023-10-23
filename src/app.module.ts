import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { TagModule } from '@app/tags/tags.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './ormconfig';
import { UsersModule } from './users/users.module';
import { AuthMuddleware } from './middlewares/auth.middleware';
import { ArticlesModule } from '@app/articles/articles.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    TagModule,
    UsersModule,
    ArticlesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMuddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
