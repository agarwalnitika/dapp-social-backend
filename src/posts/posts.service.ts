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
    });

    console.log(posts);
    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
        const [likeCount, commentCount] = await Promise.all([
          this.dataSource
            .getRepository('likes')
            .count({ where: { post: { id: post.id } } }),
          this.dataSource
            .getRepository('comments')
            .count({ where: { post: { id: post.id } } }),
          // this.dataSource
          //   .getRepository('users')
          //   .findOne({ where: { id: post.wallet_address } }),
        ]);

        return {
          ...post,
          likeCount,
          commentCount,
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
      relations: ['comments'],
    });

    if (!post) return null;

    const likeCount = await this.dataSource
      .getRepository('likes')
      .count({ where: { post: { id } } });

    return {
      ...post,
      likeCount,
      commentCount: post.comments.length,
      comments: post.comments,
    };
  }
}
