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

/**
 * Entity representing a social media post
 * Contains relationships to users, likes, and comments
 */
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

  /**
   * Relationship to the user who created the post
   * Uses wallet_address as the foreign key
   */
  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({
    name: 'wallet_address',
    referencedColumnName: 'wallet_address',
  })
  user: User;

  /**
   * One-to-many relationship with likes
   * Cascade deletes likes when post is deleted
   */
  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  /**
   * One-to-many relationship with comments
   * Cascade deletes comments when post is deleted
   */
  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
