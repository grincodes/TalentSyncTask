import { AbstractRepo } from "src/libs/db/AbstractRepo";
import { User } from "./model/user.model";

export class UsersRepo extends AbstractRepo<User> {}
