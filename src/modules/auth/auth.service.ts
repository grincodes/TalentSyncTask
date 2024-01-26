import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { JwtService } from "@nestjs/jwt";
import { Response } from "express";
import { TokenPayload } from "./interfaces/token-payload.interface";
import { User } from "./users/model/user.model";
import { Config } from "src/config";

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(user: User, response: Response) {
    const tokenPayload: TokenPayload = {
      userId: user.id,
    };

    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + Config.JWT_EXPIRATION);

    const token = this.jwtService.sign(tokenPayload);

    return token;
  }

  async validate(token: string) {
    try {
      const res = await this.jwtService.verify(token);

      return res;
    } catch (error) {
      return null;
    }
  }
}
