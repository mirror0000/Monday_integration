import { AuthsService } from './auths.service';
import { Controller, Get, Req, Res } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthsService) {}

  @Get('/monday') 
  login(@Res() res) {
    res.redirect(this.authService.getLoginUrl());
  }

  @Get('/callback') 
  async callback(@Req() req) {
    try {
      const data = await this.authService.authorize(req.query.code);
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Get('/profile')
  async profile(@Req() req) {
    try {
      return this.authService.getProfile(req.query.access_token);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
