// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { verifyMessage } from 'ethers';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async verifySignature(address: string, signature: string): Promise<boolean> {
    const message = 'Login to Tweetlet';
    try {
      const recovered = verifyMessage(message, signature);
      return recovered.toLowerCase() === address.toLowerCase();
    } catch {
      return false;
    }
  }

  async login(
    address: string,
    signature: string,
  ): Promise<{ access_token: string }> {
    const isValid = await this.verifySignature(address, signature);
    if (!isValid) throw new Error('Invalid signature');

    await this.usersService.createOrUpdate({ wallet_address: address });
    const payload = { wallet_address: address };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }
}
