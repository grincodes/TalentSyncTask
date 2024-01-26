import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { BaseEntity } from "../../../../libs/db/BaseEntity";
import { User } from "src/modules/auth/users/model/user.model";

@Entity("blogposts")
export class BlogPosts extends BaseEntity {
  @PrimaryColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column("uuid")
  authorId: string;

  @Column()
  content: string;

  @Column()
  timestamp: number;

  @ManyToOne(() => User, (user) => user.blogposts, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "authorId" })
  author?: User;
}
