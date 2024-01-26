import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { CreateGoogleUserDto, CreateUserDto } from "./dto/create-user.dto";
import { UsersRepo } from "./users.repo";
import {
  generateAccountVerficationEmailMessage,
  generateForgotPasswordEmailMessage,
  generateVerificationToken,
  handleErrorCatch,
} from "src/libs/common/helpers/utils";
import * as bcrypt from "bcryptjs";
import { UserMap } from "./mapper/UserMap";
import { InjectionTokens } from "src/libs/constants";
import { success } from "src/libs/common/types/response";

@Injectable()
export class UsersService {
  @Inject(InjectionTokens.USER_REPO)
  private readonly usersRepo: UsersRepo;

  async createUser(createUserDto: CreateUserDto) {
    try {
      const exists = await this.usersRepo.findOne({
        email: createUserDto.email,
      });

      if (exists) {
        throw new UnprocessableEntityException("Email already exists.");
      }

      // Generate verification token and set token expiration
      const verificationToken = generateVerificationToken();
      const tokenExpiration = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

      createUserDto.verificationToken = verificationToken;
      createUserDto.tokenExpiration = tokenExpiration;

      const data = UserMap.toPersistence(createUserDto);
      const res = await this.usersRepo.save(data);

      // //send verification email to user
      // const mailBody = generateAccountVerficationEmailMessage(
      //   res.email,
      //   verificationToken
      // );

      // //await sendEmail(res.email, mailBody);

      return success({
        id: res.id,
        email: res.email,
      });
    } catch (error) {
      handleErrorCatch(error);
    }
  }

  async createGoogleUser(userDto: CreateGoogleUserDto) {
    try {
      const res = await this.usersRepo.save({
        ...userDto,
        verified: true,
      });
      return res;
    } catch (error) {
      handleErrorCatch(error);
    }
  }

  async validateUser(email: string, password: string) {
    try {
      const user = await this.usersRepo.findOne({ email });

      if (!user) {
        throw new UnauthorizedException("Credentials are not valid.");
      }

      if (!user.verified) {
        throw new UnauthorizedException(`${email} has not been verified`);
      }

      const passwordIsValid = await bcrypt.compare(password, user.password);
      if (!passwordIsValid) {
        throw new UnauthorizedException("Credentials are not valid.");
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id: string) {
    try {
      const res = await this.usersRepo.findOneAndDelete({ id });
      return res;
    } catch (error) {
      handleErrorCatch(error);
    }
  }

  async getAllUsers() {
    try {
      const res = await this.usersRepo.find({});
      return res;
    } catch (error) {
      handleErrorCatch(error);
    }
  }

  async verifyUserByToken(email: string, verificationToken: string) {
    try {
      const user = await this.usersRepo.findOne({
        email,
      });
      if (!user) {
        throw new NotFoundException("user not found");
      }

      // user already verifed
      if (user.verified) {
        return success("Account already verified");
      }

      if (user.verificationToken != verificationToken) {
        throw new BadRequestException("Invalid token provided");
      }

      // Check if the verification token has expired
      if (user.tokenExpiration !== null && user.tokenExpiration < new Date()) {
        throw new BadRequestException("token has expired");
      } else {
        // Mark the user as verified and nullify the verification token
        user.verified = true;
        user.tokenExpiration = null;
        user.verificationToken = null;
        await this.usersRepo.save(user);

        return success("Account verified successfully. You can now log in.");
      }
    } catch (error: any) {
      // Handle errors or log the
      console.error(
        "An error occurred during user verification:",
        error.message
      );
      handleErrorCatch(error);
    }
  }

  async getUserById(id: string) {
    try {
      const res = await this.usersRepo.findOne({ id });
      return res;
    } catch (error) {
      handleErrorCatch(error);
    }
  }

  async getUserByEmail(email: string) {
    try {
      const res = this.usersRepo.findOne({ email });
      return res;
    } catch (error) {
      handleErrorCatch(error);
    }
  }

  async forgotPassword(email: string) {
    try {
      const user = await this.usersRepo.findOne({ email });
      const token = generateVerificationToken();

      if (user == null) throw new NotFoundException("user not found");

      const mailBody = generateForgotPasswordEmailMessage(token);

      // await sendEmail(user.email, mailBody);

      user.resetToken = token;
      await this.usersRepo.findOneAndUpdate({ email }, user);

      success("Forgot Password Email Sent");
    } catch (error: any) {
      console.error(" Error ", error.message);
      handleErrorCatch(error);
    }
  }

  async resetPassword(resetToken: string, password: string) {
    try {
      const user = await this.usersRepo.findOne({ resetToken });

      if (!user) throw new NotFoundException(" token not found");

      const saltOrRounds = 10;
      const hashed = await bcrypt.hash(password, saltOrRounds);

      const updateData = { password: hashed, resetToken: null };

      const message = "Password reset successfully";

      await this.usersRepo.findOneAndUpdate({ email: user.email }, updateData);

      return success({ message, updateData });
    } catch (error: any) {
      console.error(" Error ", error.message);
      handleErrorCatch(error);
    }
  }

  async resendVerificationEmail(email: string) {
    try {
      const user = await this.usersRepo.findOne({ email });

      if (!user) {
        throw new NotFoundException("User not found");
      }

      if (user.verified) {
        return success("User already verified");
      }

      const newVerificationToken = await generateVerificationToken();
      const tokenExpiration = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

      const mailBody = generateAccountVerficationEmailMessage(
        user.email,
        newVerificationToken
      );

      // await sendEmail(user.email, mailBody);

      const res = await this.usersRepo.findOneAndUpdate(
        { email: user.email },
        { verificationToken: newVerificationToken, tokenExpiration }
      );

      return success(res);
    } catch (error: any) {
      console.error("Error resending verification email:", error.message);
      handleErrorCatch(error);
    }
  }
}
