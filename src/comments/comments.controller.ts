import { Controller, Post, Param, Body } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('posts')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':postId/comment')
  commentPost(
    @Param('postId') postId: number,
    @Body('wallet_address') walletAddress: string,
    @Body('content') content: string,
  ) {
    return this.commentsService.commentOnPost(+postId, walletAddress, content);
  }
}
