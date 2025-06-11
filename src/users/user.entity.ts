import { Comment } from 'src/comments/comment.entity';
import { Post } from 'src/posts/post.entity';
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';

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

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
