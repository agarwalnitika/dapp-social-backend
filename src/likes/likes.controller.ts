import { Controller, Post, Param, Body, Delete } from '@nestjs/common';
import { LikesService } from './likes.service';

@Controller('posts')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post(':postId/like')
  likePost(
    @Param('postId') postId: number,
    @Body('wallet_address') walletAddress: string,
  ) {
    return this.likesService.likePost(+postId, walletAddress);
  }

  @Delete(':postId/like')
  unlikePost(
    @Param('postId') postId: number,
    @Body('wallet_address') walletAddress: string,
  ) {
    return this.likesService.unlikePost(+postId, walletAddress);
  }
}
