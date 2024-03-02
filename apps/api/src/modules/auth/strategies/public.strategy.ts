import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptionsWithRequest, ExtractJwt } from 'passport-jwt';
import { Request } from 'src/interfaces/http.interface';
import { AccessToken } from 'src/interfaces/token.interface';
import { UserService } from 'src/modules/users/users.service';


@Injectable()
export class PublicStrategy extends PassportStrategy(Strategy, 'public') {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        PublicStrategy.jwtFromRequest,
      ]),
      secretOrKey: configService.get('ACCESS_TOKEN_SECRET'),
    } as StrategyOptionsWithRequest);
  }

  async validate(payload: AccessToken) {
    const user = await this.userService.findById(payload.sub);
    return user;
  }

  authenticate(req: Request, options?: any): void {
    // Extract the access token from the request
    const accessToken = PublicStrategy.jwtFromRequest(req);

    if (!accessToken) {
      // If no access token is present, proceed without authentication
      this.success(null);
      return;
    }

    super.authenticate(req, options);
  }

  private static jwtFromRequest(req: Request): string | null {
    return req.cookies['access_token'] || null;
  }
}
