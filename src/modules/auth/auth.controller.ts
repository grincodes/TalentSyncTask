import { Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { Response } from "express";

import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { CurrentUser } from "src/libs/common/decorators/current-user.decorator";
import { User } from "./users/model/user.model";
import { AuthGuard } from "@nestjs/passport";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response
  ) {

    const token = await this.authService.login(user, response);
    response.send({
      email: user.email,
      token,
    });
  }

  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleLogin() {}

  @Get("googlecallback")
  @UseGuards(AuthGuard("google"))
  async googleLoginCallback(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response
  ) {
    const token = await this.authService.login(user, response);
    response.redirect(`${process.env.BASE_URL}/google-callback?token=${token}`);
    
  }
}
