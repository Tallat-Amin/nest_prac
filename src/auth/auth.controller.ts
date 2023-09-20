import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Response } from 'express';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() authDto: AuthDto) {
    return await this.authService.signup(authDto);
  }
  @Post('login')
  async login(
    @Body() authDto: AuthDto,
    @Req() req: Request,
    @Res({ passthrough: true }) resp: Response,
  ) {
    return await this.authService.login(authDto, req, resp);
  }
  @Post('logout')
  async logout(@Req() req: Request, @Res() resp: Response) {
    return await this.authService.logout(req, resp);
  }
}
