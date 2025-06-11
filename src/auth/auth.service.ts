// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { verifyMessage } from 'ethers';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

/**
 * Service handling authentication and user verification using Ethereum wallet signatures
 */
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  /**
   * Verifies if a signature was created by the provided wallet address
   * @param address - Ethereum wallet address
   * @param signature - Signature of the login message
   * @returns boolean indicating if signature is valid
   */
  async verifySignature(address: string, signature: string): Promise<boolean> {
    const message = 'Login to Tweetlet';
    try {
      const recovered = verifyMessage(message, signature);
      return recovered.toLowerCase() === address.toLowerCase();
    } catch {
      return false;
    }
  }

  /**
   * Authenticates a user and generates a JWT token
   * @param address - Ethereum wallet address
   * @param signature - Signature of the login message
   * @returns Object containing the JWT access token
   * @throws Error if signature is invalid
   */
  async login(
    address: string,
    signature: string,
  ): Promise<{ access_token: string }> {
    const isValid = await this.verifySignature(address, signature);
    if (!isValid) throw new Error('Invalid signature');

    // Create or update user profile
    await this.usersService.createOrUpdate({ wallet_address: address });

    // Generate JWT token
    const payload = { wallet_address: address };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }
}
