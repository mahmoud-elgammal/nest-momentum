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
  async register(@Body() registerDTO: RegisterDTO, @Res() res: Response, @IpAddress() ip: string, @Headers('User-Agent') ua: string) {
    const uaParsed = new UAParser(ua);
    const location = geoip.lookup(ip);
    const tokens = await this.authService.register(registerDTO, ip, location, uaParsed);
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
  async login(@Req() req: Request, @Res() res: Response, @IpAddress() ip: string, @Headers('User-Agent') ua: string) {
    const uaParsed = new UAParser(ua);
    const location = geoip.lookup(ip);

    const tokens = await this.authService.login(req.user, ip, location, uaParsed);

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
  async generateToken(@Req() req: any, @Res() res: Response, @IpAddress() ip: string, @Headers('User-Agent') ua: string) {
    const uaParsed = new UAParser(ua);
    const location = geoip.lookup(ip);

    const tokens = await this.authService.refreshToken(req.user.user, req.user, ip, location, uaParsed);

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

  @Get('logout')
  @UseRefreshTokenGuard()
  async logout(@Req() req: any,@Res() res: Response) {
     await res.clearCookie('access_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });

      await res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });

    await this.authService.logout(req.user);

    res.json({ok: true, message: 'Session has deleted'})
  }

  @Get('sessions')
  @UseAccessTokenGuard()
  async getSessions(@Req() req: Request) {
    return await this.authService.getSessions(req.user);
  }
}
