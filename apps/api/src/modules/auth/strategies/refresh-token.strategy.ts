import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from "passport-jwt";
import { UserService } from "src/modules/users/users.service";
import { Request } from 'src/interfaces/http.interface';
import { RefreshToken } from "src/interfaces/token.interface";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh-token') {

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies['refresh_token'],
      ]),
      secretOrKey: configService.get('REFRESH_TOKEN_SECRET'),
    } as StrategyOptionsWithRequest);
  }

  async validate(payload: RefreshToken): Promise<any> {

    if (payload && payload.sub) {
      // If a user ID is present in the payload, validate and return the user
      const user = await this.userService.findById(payload.sub);
      if (user) {
        return {...payload, user};
      }
    }

    // If no user ID is present or user is not found, return null (no authentication)
    throw new UnauthorizedException();
  }
}