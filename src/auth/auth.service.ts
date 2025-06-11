import { Injectable } from '@nestjs/common';
import { verifyMessage } from 'ethers';

@Injectable()
export class AuthService {
  verifySignature(address: string, signature: string): Promise<boolean> {
    const message = 'Login to DecentraTweet';
    try {
      const recovered = verifyMessage(message, signature);
      return Promise.resolve(recovered.toLowerCase() === address.toLowerCase());
    } catch {
      return Promise.resolve(false);
    }
  }
}
