import { RedisService } from './../../common/redis/redis.service';
import { MailService } from './../mail/mail.service';
import { Injectable, Logger } from '@nestjs/common';
import { TokenService } from './token.service';
import { UserService } from './../users/users.service';
import { TokenResponse, AccessToken, RefreshToken } from 'src/interfaces/token.interface';
import { RegisterDTO } from './dto/register.dto';
import { UserDocument } from '../users/models/users.model';

import { randomBytes } from 'crypto';
import { VerifyEmailDTO } from './dto/verify-email.dto';
import { UAParserInstance } from 'ua-parser-js';
import * as geoip from 'geoip-lite';
import { BadRequestException } from 'src/exceptions';
import * as uuid from 'uuid';

const generateVerificationCode = () => {
  return randomBytes(6).toString('hex').toUpperCase(); // Adjust the code length as needed
};

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private mailService: MailService,
    private readonly redisService: RedisService,
  ) { }
  /**
   * TODO
   * forget password
   */

  async register(registerDTO: RegisterDTO, ip: string, location: geoip.Lookup, ua: UAParserInstance): Promise<TokenResponse> {
    const user = await this.userService.create(registerDTO);
    const device = ua.getDevice().type || 'Desktop';
    const deviceId = generateVerificationCode();
    const tokens = this.tokenService.generateTokens(user, 0, deviceId, device, location?.country && `${location.country}, ${location.city}`);
    const code = generateVerificationCode();

    const key = `verification:${user.email}`;
    await this.redisService.set(key, code, '5m'); // Expire in 5 minutes (adjust as needed)

    this.mailService.send({
      template: 'email-verification',
      subject: 'Email Verification 🛫',
      user: user,
      data: {
        name: `${user.firstName} ${user.lastName}`,
        time: '5 minutes',
        link: `/email-verification?code=${code}`,
        code: code,
      },
    });

    return tokens;
  }

  async verifyEmail(verifyEmailDTO: VerifyEmailDTO): Promise<boolean> {
    const key = `verification:${verifyEmailDTO.email}`;
    const storedCode = await this.redisService.get(key);

    if (storedCode && storedCode === verifyEmailDTO.code) {
      // Verification successful, cleanup the code from Redis
      await this.cleanupVerificationCode(verifyEmailDTO.email);
      return true;
    }

    return false;
  }

  login(user: UserDocument, ip: string, location: geoip.Lookup, ua: UAParserInstance): TokenResponse {
    const device = ua.getDevice().type || 'Desktop';
    const deviceId = generateVerificationCode();
    const tokens = this.tokenService.generateTokens(user, 0, deviceId, device, location?.country && `${location.country}, ${location.city}`);
    //  if (!user.emails.find((i) => i.emailSafe === emailSafe)?.isVerified)
    //   throw new UnauthorizedException(UNVERIFIED_EMAIL);
    return tokens;
  }

  async forgetPassword(
    email: string,
    ip: string,
    location: geoip.Lookup,
    ua: UAParserInstance,
  ) {
    const user = await this.userService.findByEmail(email);
    const code = generateVerificationCode();

    const os = ua.getOS(); // {name: windows, version: 10} -> windows 10
    const browser = ua.getBrowser().name;
    const device = ua.getDevice().type || 'Desktop';

    // Store the verification code in Redis with a specified expiration time (e.g., 15 minutes)
    await this.redisService.set(`password-reset:${user._id}`, code, '5m');

    this.mailService.send({
      template: 'password-reset',
      user: user,
      subject: 'Reset Password 🔒',
      data: {
        name: `${user.firstName} ${user.lastName}`,
        time: '5 minutes',
        link: `/password-reset?code=${code}`,
        code: code,
        device,
        os: os.name ? `${os.name} ${os.version}` : 'unknown',
        browser: browser || 'unknown',
        ip,
        location: location.country
          ? `${location.country}, ${location.city}`
          : 'unknown',
      },
    });

    return { status: true, msg: 'RESET_PASSWORD_SENDED' };
  }

  async resetPassword(user, password, code) {
    // Store the verification code in Redis with a specified expiration time (e.g., 15 minutes)
    const storedCode = await this.redisService.get(
      `password-reset:${user._id}`,
    );

    if (storedCode && storedCode === code) {
      // block other devices -> up version of refresh token
      await this.userService.resetPassword(user._id, password);

      // Verification successful, cleanup the code from Redis
      await this.cleanupResetPasswordCode(user);
      return true;
    }
  }

  async refreshToken(
    user: UserDocument,
    oldToken: RefreshToken,
    ip: string,
    location: geoip.Lookup,
    ua: UAParserInstance,
  ): Promise<TokenResponse> {
    const device = ua.getDevice().type || 'Desktop';

    const session = await this.tokenService.getSession(user._id, oldToken.deviceId);
    this.logger.log(session);
    if (!session) throw new BadRequestException()

    const tokens = this.tokenService.generateTokens(user, ++oldToken.version, oldToken.deviceId, device, location?.country && `${location.country}, ${location.city}`);
    return tokens;
  }

  async logout(session) {
    return await this.tokenService.deleteSession(session.user._id, session.deviceId)
  }

  current(payload: AccessToken) {
    const user = this.userService.findById(payload.sub);
    return user;
  }

  async cleanupVerificationCode(email: string): Promise<void> {
    const key = `verification:${email}`;
    await this.redisService.delete(key);
  }

  async cleanupResetPasswordCode(user): Promise<void> {
    const key = `password-reset:${user._id}`;
    await this.redisService.delete(key);
  }

  async getSessions(user: any) {
    const sessions = await this.tokenService.getSessions(user._id, user.deviceId);
    return sessions
  }
}
