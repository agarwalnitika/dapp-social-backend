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

  async createOrUpdate(user: Partial<User>): Promise<User> {
    const existingUser = await this.usersRepo.findOne({
      where: { wallet_address: user.wallet_address },
    });

    if (!existingUser) {
      // Create new user with defaults if not provided
      const newUser = this.usersRepo.create({
        wallet_address: user.wallet_address,
        username: user.username || `user_${user.wallet_address?.slice(2, 6)}`,
        bio: user.bio || '',
        profile_picture_url:
          user.profile_picture_url || 'https://i.pravatar.cc/150',
      });
      return await this.usersRepo.save(newUser);
    }

    // Update existing user with provided fields
    const updatedUser = this.usersRepo.merge(existingUser, user);
    return await this.usersRepo.save(updatedUser);
  }
}
