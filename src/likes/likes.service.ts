import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './like.entity';
import { Post } from '../posts/post.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepo: Repository<Like>,
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
  ) {}

  async likePost(postId: number, wallet_address: string): Promise<Like> {
    const post = await this.postRepo.findOneBy({ id: postId });
    if (!post) throw new NotFoundException('Post not found');

    const existing = await this.likeRepo.findOne({
      where: { wallet_address, post: { id: postId } },
    });

    if (existing) return existing;

    const like = this.likeRepo.create({ post, wallet_address });
    return this.likeRepo.save(like);
  }

  async unlikePost(postId: number, wallet_address: string): Promise<string> {
    const existingLike = await this.likeRepo.findOne({
      where: { wallet_address, post: { id: postId } },
      relations: ['posts'],
    });

    if (!existingLike) {
      return 'Like not found';
    }

    await this.likeRepo.remove(existingLike);
    return 'Unliked successfully';
  }
}
