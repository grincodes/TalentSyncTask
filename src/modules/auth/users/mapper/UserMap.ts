import { CreateUserDto } from "../dto/create-user.dto";
import * as bcrypt from "bcryptjs";
import { User } from "../model/user.model";

export class UserMap {
  public static toPersistence(dto: CreateUserDto): User {
    return {
      email: dto.email,
      password: bcrypt.hashSync(dto.password, 10),
      verificationToken: dto.verificationToken,
      tokenExpiration: dto.tokenExpiration,
      verified: true,
    };
  }
}
