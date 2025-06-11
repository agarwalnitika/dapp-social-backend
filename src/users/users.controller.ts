import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':wallet')
  async getUser(@Param('wallet') wallet: string): Promise<User> {
    const user = await this.usersService.findByWallet(wallet);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Post()
  async createOrUpdateUser(@Body() userData: User): Promise<User> {
    return this.usersService.createOrUpdate(userData);
  }
}
