import { Module } from "@nestjs/common";
import { BlogController } from "./infra/http/BlogPostController";
import { BlogPostService } from "./application/BlogPostService";
import { InjectionTokens } from "src/libs/constants";
import { BlogPostsRepo } from "./infra/repository/BlogPostRepo";
import { BlogPosts } from "./infra/entity/BlogPost.model";

const infrastructure = [
  {
    provide: InjectionTokens.BLOG_POSTS_REPO,
    useFactory: () => {
      return new BlogPostsRepo(BlogPosts);
    },
  },
];

@Module({
  controllers: [BlogController],
  providers: [...infrastructure, BlogPostService],
})
export class BlogModule {}
