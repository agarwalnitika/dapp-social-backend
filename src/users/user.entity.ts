import { Comment } from 'src/comments/comment.entity';
import { Post } from 'src/posts/post.entity';
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';

/**
 * Entity representing a user in the social media platform
 * Uses Ethereum wallet address as primary identifier
 */
@Entity('users')
export class User {
  @PrimaryColumn()
  wallet_address: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  profile_picture_url: string;

  @Column({ nullable: true })
  bio: string;

  /**
   * One-to-many relationship with posts
   * A user can have multiple posts
   */
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  /**
   * One-to-many relationship with comments
   * A user can have multiple comments
   */
  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
