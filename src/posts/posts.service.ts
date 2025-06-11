import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    private readonly dataSource: DataSource,
  ) {}

  async getAllPostsWithCounts() {
    const posts = await this.postsRepository.find({
      order: { timestamp: 'DESC' },
      relations: ['user'],
    });

    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
        const [likeCount, commentCount] = await Promise.all([
          this.dataSource
            .getRepository('likes')
            .count({ where: { post: { id: post.id } } }),
          this.dataSource
            .getRepository('comments')
            .count({ where: { post: { id: post.id } } }),
        ]);

        return {
          ...post,
          likeCount,
          commentCount,
          user: {
            walletAddress: post.user?.wallet_address,
            username: post.user?.username,
            profilePicture: post.user?.profile_picture_url,
            bio: post.user?.bio,
          },
        };
      }),
    );

    return postsWithCounts;
  }

  async createPost(wallet_address: string, content: string): Promise<Post> {
    const post = this.postsRepository.create({
      wallet_address,
      content,
      timestamp: new Date(),
    });
    return this.postsRepository.save(post);
  }

  async getPostById(id: number): Promise<any> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['comments', 'comments.user', 'user'],
    });

    if (!post) return null;

    console.log(post);
    const likeCount = await this.dataSource
      .getRepository('likes')
      .count({ where: { post: { id } } });

    return {
      ...post,
      likeCount,
      commentCount: post.comments.length,
      user: {
        walletAddress: post.user?.wallet_address,
        username: post.user?.username,
        profilePicture: post.user?.profile_picture_url,
        bio: post.user?.bio,
      },
      comments: post.comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        timestamp: comment.timestamp,
        wallet_address: comment.wallet_address,
        user: {
          walletAddress: comment.user?.wallet_address,
          username: comment.user?.username,
          profilePicture: comment.user?.profile_picture_url,
          bio: comment.user?.bio,
        },
      })),
    };
  }
}
