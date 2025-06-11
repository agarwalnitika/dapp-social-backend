import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Post } from '../posts/post.entity';
import { User } from 'src/users/user.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  wallet_address: string;

  @Column({ nullable: true })
  content: string;

  @CreateDateColumn()
  timestamp: Date;

  @ManyToOne(() => Post, (post) => post.comments, {
    onDelete: 'CASCADE',
  })
  post: Post;

  @ManyToOne(() => User, (user) => user.comments, {
    eager: false,
    nullable: true,
  })
  @JoinColumn({
    name: 'wallet_address',
    referencedColumnName: 'wallet_address',
  })
  user: User;
}
