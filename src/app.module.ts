
import { Module } from '@nestjs/common';
import { HttpErrorFilter } from './shared/http-error.filter';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IdeaModule } from './idea/idea.module';
import { UserModule } from './user/user.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [IdeaModule, 
    TypeOrmModule.forRoot(), UserModule, CommentModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
