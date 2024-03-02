import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptionsWithRequest, ExtractJwt } from 'passport-jwt';
import { Request } from 'src/interfaces/http.interface';
import { AccessToken } from 'src/interfaces/token.interface';
import { UserService } from 'src/modules/users/users.service';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'access_token') {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies['access_token'],
      ]),
      secretOrKey: configService.get('ACCESS_TOKEN_SECRET'),
    } as StrategyOptionsWithRequest);
  }

  async validate(payload: AccessToken) {
    const user = await this.userService.findById(payload.sub);
    return user;
  }
}
