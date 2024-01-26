import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";

import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";
import { User } from "./model/user.model";
import { CurrentUser } from "src/libs/common/decorators/current-user.decorator";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { ResendVerificationDto } from "./dto/resend-verification.dto";

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("auth/register")
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get("users")
  async getAllUser() {
    return this.usersService.getAllUsers();
  }

  @Get("user/me")
  @UseGuards(JwtAuthGuard)
  async getUser(@CurrentUser() user: User) {
    return user;
  }

  @Post("user/forgotPassword")
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.usersService.forgotPassword(dto.email);
  }

  @Post("user/resend/verificationLink")
  async resetLink(@Body() dto: ResendVerificationDto) {
    return this.usersService.resendVerificationEmail(dto.email);
  }

  @Get("user/verify/:email/:token")
  async verifyUser(
    @Param("email") email: string,
    @Param("token") token: string
  ) {
    return this.usersService.verifyUserByToken(email, token);
  }

  @Delete("user/:id")
  async deleteUser(@Param("id") id: string) {
    return this.usersService.deleteUser(id);
  }

  @Post("user/reset/password/:token")
  async resetPassword(
    @Param("token") token: string,
    @Body() dto: ResetPasswordDto
  ) {
    return this.usersService.resetPassword(token, dto.password);
  }

  
}
