import { Module } from "@nestjs/common";

import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UsersModule } from "./users/users.module";

import { LocalStrategy } from "./strategies/local.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { Config } from "src/config";
import { GoogleStrategy } from "./strategies/google.strategy";

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: Config.JWT_SECRET,
        signOptions: {
          expiresIn: `${Config.JWT_EXPIRATION}s`,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, GoogleStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
