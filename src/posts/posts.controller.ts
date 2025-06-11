import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(@Body() body: { wallet_address: string; content: string }) {
    return this.postsService.createPost(body.wallet_address, body.content);
  }

  @Get()
  async findAll() {
    return this.postsService.getAllPostsWithCounts();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.postsService.getPostById(parseInt(id));
  }
}
