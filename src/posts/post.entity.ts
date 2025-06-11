import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Like } from '../likes/like.entity';
import { Comment } from '../comments/comment.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '0xdeadbeef', nullable: false })
  wallet_address: string;

  @Column({ default: 'empty', length: 280, nullable: false })
  content: string;

  @CreateDateColumn()
  timestamp: Date;

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
