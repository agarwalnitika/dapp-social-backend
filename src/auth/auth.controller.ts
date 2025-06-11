// src/auth/auth.controller.ts
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('verify') // or just '/' if preferred
  async authenticate(
    @Body() body: { message: string; signature: string; address: string },
  ) {
    try {
      const { access_token } = await this.authService.login(
        body.address,
        body.signature,
      );

      return { success: true, token: access_token };
    } catch (err) {
      throw new BadRequestException(err.message || 'Login failed');
    }
  }
}
