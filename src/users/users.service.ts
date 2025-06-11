import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async findByWallet(wallet: string): Promise<User | null> {
    return this.usersRepo.findOneBy({ wallet_address: wallet });
  }

  async createOrUpdate(user: User): Promise<User> {
    return this.usersRepo.save(user); // Creates or updates based on primary key
  }
}
