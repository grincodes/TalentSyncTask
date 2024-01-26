import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";
import { Config } from "src/config";
import { UsersService } from "../users/users.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(private readonly usersService: UsersService) {
    super({
      clientID: Config.GOOGLE_CLIENT_ID,
      clientSecret: Config.GOOGLE_CLIENT_SECRET,
      callbackURL: Config.GOOGLE_REDIRECT_URL,
      passReqToCallback: true,
      scope: ["profile", "email"],
    });
  }

  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile: any
    // done: Function
  ) {
    const { emails, id, displayName } = profile;
    const [firstName, lastName] = displayName.split(" ");

    const existingUser = await this.usersService.getUserByEmail(
      emails[0].value
    );

    if (existingUser) {
      // If the user exists, pass the existing user to Passport.js
      return existingUser;
    }

    // If the user doesn't exist, create a new user based on the Google profile
    const newUser = await this.usersService.createGoogleUser({
      firstName,
      lastName,
      email: profile.emails[0].value,
      password: "",
    });

    // Pass the newly created user to Passport.js
    return newUser;
  }
}
