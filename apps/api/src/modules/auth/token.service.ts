import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AccessToken,
  RefreshToken,
  TokenResponse,
} from 'src/interfaces/token.interface';
import { UserDocument } from '../users/models/users.model';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateAccessToken(user: UserDocument): string {
    const secret = this.configService.get('ACCESS_TOKEN_SECRET');
    const expiresIn = this.configService.get('ACCESS_TOKEN_EXPIRATION'); // Access token expiration time, adjust as needed
    const payload: AccessToken = {
      sub: user._id.toHexString(),
      version: 0,
    };

    return this.jwtService.sign(payload, { expiresIn, secret });
  }

  generateRefreshToken(user: UserDocument): string {
    const secret = this.configService.get('REFRESH_TOKEN_SECRET');
    const expiresIn = this.configService.get('ACCESS_TOKEN_EXPIRATION'); // Access token expiration time, adjust as needed

    const payload: RefreshToken = {
      sub: user._id.toHexString(),
      version: 0,
      device: 'xx-xx-xx',
    };

    return this.jwtService.sign(payload, { expiresIn, secret });
  }

  generateTokens(user: UserDocument): TokenResponse {
    const tokens: TokenResponse = {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user),
    };
    return tokens;
  }

  verifyAccessToken(token: string): any {
    const secret = this.configService.get('REFRESH_TOKEN_SECRET');
    return this.jwtService.verify(token, secret);
  }

  verifyRefreshToken(token: string): any {
    const secret = this.configService.get('ACCESS_TOKEN_SECRET');
    return this.jwtService.verify(token, secret);
  }
}
