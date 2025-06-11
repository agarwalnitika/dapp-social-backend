import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('verify')
  async verifySignature(@Body() body: { address: string; signature: string }) {
    const { address, signature } = body;
    if (!address || !signature) {
      throw new BadRequestException('Missing address or signature');
    }

    const isValid = await this.authService.verifySignature(address, signature);
    if (!isValid) {
      throw new BadRequestException('Invalid signature');
    }

    return { message: 'Signature verified', address };
  }
}
