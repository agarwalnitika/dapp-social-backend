import { Comment } from 'src/comments/comment.entity';
import { Like } from 'src/likes/like.entity';
import { User } from 'src/users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @CreateDateColumn()
  timestamp: Date;

  @Column()
  wallet_address: string;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({
    name: 'wallet_address',
    referencedColumnName: 'wallet_address',
  })
  user: User;

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
