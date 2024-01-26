import {
  Injectable,
  CanActivate,
  Logger,
  ExecutionContext,
} from "@nestjs/common";

import { Socket } from "socket.io";
import { WsException } from "@nestjs/websockets";

import { Observable } from "rxjs";
import { AuthService } from "../auth.service";

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() !== "ws") {
      return true;
    }

    const client: Socket = context.switchToWs().getClient();
    let authorization =
      client.handshake.headers.authorization ||
      client.handshake.auth.authorization;

    if (!authorization) {
      throw new WsException("Unauthorized");
    }

    const res = await this.authService.validate(authorization);

    if (!res) {
      return false;
    }

    client.data.user = res;
    return true;
  }

  static async validateToken(
    client: Socket,
    authService: AuthService
  ): Promise<boolean> {
    const { authorization } = client.handshake.headers || client.handshake.auth;

    if (!authorization) {
      throw new WsException("Unauthorized");
    }

    return authService
      .validate(authorization)
      .then((res) => {
        if (!res) {
          throw new WsException("Unauthorized");
        }

        client.data.user = res;
        return true;
      })
      .catch((error) => {
        throw new WsException("Unauthorized");
      });
  }
}
