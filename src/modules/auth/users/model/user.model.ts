import {
  Entity,
  Column,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseEntity } from "../../../../libs/db/BaseEntity";
import { UniqueEntityID } from "src/libs/domain/UniqueEntityID";
import { BlogPosts } from "src/modules/blog-post/infra/entity/BlogPost.model";

@Entity("users")
export class User extends BaseEntity {
  // @PrimaryColumn( { default: new UniqueEntityID().toValue() })
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ default: false })
  verified?: boolean;

  @Column({
    nullable: true,
  })
  lastLoggedInAt?: Date;

  @Column({ nullable: true })
  verificationToken?: string | null;

  @Column({ nullable: true })
  resetToken?: string | null;

  @Column({ type: "timestamptz", nullable: true })
  tokenExpiration?: Date | null;

  @OneToMany(() => BlogPosts, (blogpost) => blogpost.author, {
    cascade: true,
  })
  blogposts?: BlogPosts[];
}
