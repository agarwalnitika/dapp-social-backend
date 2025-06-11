import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { Post } from '../posts/post.entity';

/**
 * Service handling post comments
 */
@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
  ) {}

  /**
   * Adds a comment to a post
   * @param postId - ID of the post to comment on
   * @param wallet_address - Ethereum wallet address of the commenter
   * @param content - Content of the comment
   * @returns The created comment
   * @throws NotFoundException if post doesn't exist
   */
  async commentOnPost(
    postId: number,
    wallet_address: string,
    content: string,
  ): Promise<Comment> {
    const post = await this.postRepo.findOneBy({ id: postId });
    if (!post) throw new NotFoundException('Post not found');

    // Create and save new comment
    const comment = this.commentRepo.create({ post, wallet_address, content });
    return this.commentRepo.save(comment);
  }
}
