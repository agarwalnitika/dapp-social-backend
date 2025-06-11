import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { CommentsController } from './comments/comments.controller';
import { LikesController } from './likes/likes.controller';
import { LikesService } from './likes/likes.service';
import { CommentsService } from './comments/comments.service';
import { LikesModule } from './likes/likes.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432'),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, // turn off in production
    }),
    UsersModule,
    AuthModule,
    PostsModule,
    LikesModule,
    CommentsModule,
  ],
  controllers: [CommentsController, LikesController],
  providers: [],
})
export class AppModule {}
