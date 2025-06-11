// auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { verifyMessage } from 'ethers';

@Controller('auth')
export class AuthController {
  @Post()
  authenticate(
    @Body() body: { message: string; signature: string; address: string },
  ) {
    const recovered: string = verifyMessage(body.message, body.signature);
    if (recovered.toLowerCase() !== body.address.toLowerCase()) {
      return { success: false, error: 'Signature invalid' };
    }
    return { success: true };
  }
}
