import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RedisModule } from '@app/common';
import { UsersModule } from '../users/users.module';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { PublicStrategy } from './strategies/public.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [JwtModule.register({}), PassportModule.register({}), UsersModule, RedisModule, MailModule],
  providers: [AuthService, TokenService, LocalStrategy, AccessTokenStrategy, PublicStrategy, RefreshTokenStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
