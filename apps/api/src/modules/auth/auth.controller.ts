import { Body, Controller, Get, Ip, Logger, Param, Post, Req, Res, ValidationPipe, Headers } from '@nestjs/common';
import { VerifyEmailDTO } from './dto/verify-email.dto';
import { UseAccessTokenGuard } from './../../guards/access-token.guard';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/register.dto';
import { BadRequestException } from 'src/exceptions';
import { Request, Response } from 'src/interfaces/http.interface';
import { UseLocalAuthGuard, UseRefreshTokenGuard } from 'src/guards';
import { UAParser } from 'ua-parser-js';
import * as geoip from 'geoip-lite';
import { IpAddress } from 'src/decorators/ip-address.decorator';
import { ForgetPasswordDTO } from './dto/forget-password';


@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDTO: RegisterDTO, @Res() res: Response) {
    const tokens = await this.authService.register(registerDTO);
    try {
     await res.cookie('access_token', tokens.accessToken, {
        expires: new Date(Date.now() + 30 * 24 * 3600000),
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });

      await res.cookie('refresh_token', tokens.refreshToken, {
        expires: new Date(Date.now() + 30 * 24 * 3600000),
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });

       res.status(200).json({ status: 'ok', msg: 'USER_CREATED_SUCCESSFULLY' });
    } catch (err) {
        this.logger.warn(err);
        throw new BadRequestException('USER_REGISTRATION_FAILED');
    }
  }

  @Post('login')
  @UseLocalAuthGuard()
  async login(@Req() req: Request, @Res() res: Response) {
    const tokens = await this.authService.login(req.user);;
    try {
     await res.cookie('access_token', tokens.accessToken, {
        expires: new Date(Date.now() + 30 * 24 * 3600000),
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });

      await res.cookie('refresh_token', tokens.refreshToken, {
        expires: new Date(Date.now() + 30 * 24 * 3600000),
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });
       res.status(200).json({ status: 'ok', msg: 'USER_LOGIN_SUCCESSFULLY' });
    } catch (err) {
        this.logger.warn(err);
        throw new BadRequestException('USER_LOGIN_FAILED');
    }
  }

  @Get('refresh')
  @UseRefreshTokenGuard()
  async generateToken(@Req() req: Request, @Res() res: Response) {
    const tokens = await this.authService.refreshToken(req.user);

     await res.cookie('access_token', tokens.accessToken, {
        expires: new Date(Date.now() + 30 * 24 * 3600000),
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });

      await res.cookie('refresh_token', tokens.refreshToken, {
        expires: new Date(Date.now() + 30 * 24 * 3600000),
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });
  
      res.status(200).json({ status: true, msg: 'GENERATE_TOKENS_SUCCESSFULLY' });
  }

  @Get('email/:email/verification/:code')
  async verifyEmail(@Param(ValidationPipe) verifyEmailDTO: VerifyEmailDTO) {
    const verified = await this.authService.verifyEmail(verifyEmailDTO);

    if (verified) return { ok: true, msg: 'Email verification successful!' };
    return { ok: false, msg: 'Invalid verification code.' }
  }

  @Get('current-user')
  @UseAccessTokenGuard()
  current(@Req() req: Request) {
    return req.user;
  }

  @Get('email/:email/forget-password')
  async forgetPassword(@Param(ValidationPipe) forgetPasswordDTO: ForgetPasswordDTO, @IpAddress() ip: string, @Headers('User-Agent') ua: string) {
    const uaParsed = new UAParser(ua);
    const location = geoip.lookup(ip);
    return this.authService.forgetPassword(forgetPasswordDTO.email, ip, location, uaParsed);
  }
}
