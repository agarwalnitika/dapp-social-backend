import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Like } from 'src/likes/like.entity';
import { Comment } from 'src/comments/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Like, Comment])],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
