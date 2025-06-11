import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './like.entity';
import { Post } from '../posts/post.entity';

/**
 * Service handling post likes and unlikes
 */
@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepo: Repository<Like>,
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
  ) {}

  /**
   * Adds a like to a post if it doesn't exist
   * @param postId - ID of the post to like
   * @param wallet_address - Ethereum wallet address of the user liking the post
   * @returns The created like or existing like if already liked
   * @throws NotFoundException if post doesn't exist
   */
  async likePost(postId: number, wallet_address: string): Promise<Like> {
    const post = await this.postRepo.findOneBy({ id: postId });
    if (!post) throw new NotFoundException('Post not found');

    // Check if user already liked the post
    const existing = await this.likeRepo.findOne({
      where: { wallet_address, post: { id: postId } },
    });

    if (existing) return existing;

    // Create and save new like
    const like = this.likeRepo.create({ post, wallet_address });
    return this.likeRepo.save(like);
  }

  /**
   * Removes a like from a post
   * @param postId - ID of the post to unlike
   * @param wallet_address - Ethereum wallet address of the user unliking the post
   * @returns Success message or 'Like not found' if like doesn't exist
   */
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
