import { AbstractRepo } from "src/libs/db/AbstractRepo";
import { BlogPosts } from "../entity/BlogPost.model";

export class BlogPostsRepo extends AbstractRepo<BlogPosts> {}
