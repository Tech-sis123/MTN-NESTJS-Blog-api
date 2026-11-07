import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PostsModule } from './posts/posts.module.js';
import { CommentsModule } from './comments/comments.module.js';

// The root module: the starting point Nest reads to discover every part of the app.
@Module({
  imports: [
    // Loads variables from a .env file (if there is one) into ConfigService.
    ConfigModule.forRoot({ isGlobal: true }),
    // Opens ONE database connection for the whole app. forRootAsync lets us read the
    // address from ConfigService; without MONGODB_URI it uses your local MongoDB.
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>(
          'MONGODB_URI',
          'mongodb://127.0.0.1:27017/blog-api',
        ),
      }),
    }),
    // Feature modules; add new ones here.
    PostsModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
