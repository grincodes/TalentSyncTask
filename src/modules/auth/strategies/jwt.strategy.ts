import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { TokenPayload } from "../interfaces/token-payload.interface";
import { UsersService } from "../users/users.service";
import { Config } from "src/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Config.JWT_SECRET,
    });
  }

  async validate({ userId }: TokenPayload) {
    const res = await this.usersService.getUserById(userId);

    if (!res) {
      return res;
    }

    const { password, ...user } = res;

    return user;
  }
}
