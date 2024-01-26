import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { InjectionTokens } from "src/libs/constants";
import { UsersRepo } from "./users.repo";
import { User } from "./model/user.model";

const infrastructure = [
  {
    provide: InjectionTokens.USER_REPO,
    useFactory: () => {
      return new UsersRepo(User);
    },
  },
];

@Module({
  controllers: [UsersController],
  providers: [...infrastructure, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
