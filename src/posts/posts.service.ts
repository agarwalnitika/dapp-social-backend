import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository, DataSource } from 'typeorm';

/**
 * Service handling post operations including creation, retrieval, and interaction counts
 */
@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Retrieves all posts with their like and comment counts
   * @returns Array of posts with metadata including like and comment counts
   */
  async getAllPostsWithCounts() {
    const posts = await this.postsRepository.find({
      order: { timestamp: 'DESC' },
      relations: ['user'],
    });

    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
        // Get like and comment counts for each post
        const [likeCount, commentCount] = await Promise.all([
          this.dataSource
            .getRepository('likes')
            .count({ where: { post: { id: post.id } } }),
          this.dataSource
            .getRepository('comments')
            .count({ where: { post: { id: post.id } } }),
        ]);

        // Return post with metadata and user info
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

  /**
   * Creates a new post
   * @param wallet_address - Ethereum wallet address of the post creator
   * @param content - Content of the post
   * @returns The created post
   */
  async createPost(wallet_address: string, content: string): Promise<Post> {
    const post = this.postsRepository.create({
      wallet_address,
      content,
      timestamp: new Date(),
    });
    return this.postsRepository.save(post);
  }

  /**
   * Retrieves a single post with its comments and like count
   * @param id - Post ID
   * @returns Post with full details including comments and metadata
   */
  async getPostById(id: number): Promise<any> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['comments', 'comments.user', 'user'],
    });

    if (!post) return null;

    // Get like count for the post
    const likeCount = await this.dataSource
      .getRepository('likes')
      .count({ where: { post: { id } } });

    // Return post with full details
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
