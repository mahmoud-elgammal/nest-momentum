import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AccessToken,
  RefreshToken,
  TokenResponse,
} from 'src/interfaces/token.interface';
import { UserDocument } from '../users/models/users.model';
import { RedisService } from 'src/common/redis/redis.service';

const getLastKey = (key: string) => key.substring(key.lastIndexOf(':')+1, key.length)

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService
  ) { }

  generateAccessToken(user: UserDocument, deviceId: string): string {
    const secret = this.configService.get('ACCESS_TOKEN_SECRET');
    const expiresIn = this.configService.get('ACCESS_TOKEN_EXPIRATION'); // Access token expiration time, adjust as needed

    const payload: AccessToken = {
      sub: user._id.toHexString(),
      deviceId,
    };

    return this.jwtService.sign(payload, { expiresIn, secret });
  }

  generateRefreshToken(user: UserDocument, version: number, deviceId: string, device: string, location): string {
    const secret = this.configService.get('REFRESH_TOKEN_SECRET');
    const expiresIn = this.configService.get('ACCESS_TOKEN_EXPIRATION'); // Access token expiration time, adjust as needed

    const payload: RefreshToken = {
      sub: user._id.toHexString(),
      version,
      deviceId,
    };
    this.storeSession(user._id, deviceId, device, location);
    return this.jwtService.sign(payload, { expiresIn, secret });
  }

  generateTokens(user: UserDocument, version: number, deviceId: string, device: string, location: string): TokenResponse {
    const tokens: TokenResponse = {
      accessToken: this.generateAccessToken(user, deviceId),
      refreshToken: this.generateRefreshToken(user, version, deviceId, device, location),
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

  async storeSession(userId, deviceId, device, location) {
    const key = `token:${userId}:${deviceId}`;
    await this.redisService.hset(key, { device, location, lastActive: new Date() }, this.configService.get('REFRESH_TOKEN_EXPIRATION'));
    console.log({ device, location, lastActive: new Date() })
  }

  async getSession(userId, deviceId) {
    const key = `token:${userId}:${deviceId}`;
    return await this.redisService.hget(key);
  }

  async getSessions(userId, deviceId) {
    const key = `token:${userId}:*`;
    const keys = await this.redisService.scan(key);
    // const sessions = []
    
    const sessions = await Promise.all(keys.map(key => this.redisService.hget(key)));
    return sessions.map((session, i) => ({...session, isCurrent: getLastKey(keys[i]) === deviceId}))
  }

  async deleteSession(userId, deviceId) {
    const key = `token:${userId}:${deviceId}`;
    await this.redisService.hdel(key)
    return true;
  }
}
