import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { handleErrorCatch } from "src/libs/common/helpers/utils";

import { InjectionTokens } from "src/libs/constants";
import { CreateBlogPostDto } from "../dto/CreateBlogPost.dto";
import { UniqueEntityID } from "src/libs/domain/UniqueEntityID";
import { BlogPostsRepo } from "../infra/repository/BlogPostRepo";

@Injectable()
export class BlogPostService {
  @Inject(InjectionTokens.BLOG_POSTS_REPO)
  private readonly blogPostsRepo: BlogPostsRepo;

  async createBlogPost(dto: CreateBlogPostDto) {
    try {
      const res = await this.blogPostsRepo.save({
        id: new UniqueEntityID().toString(),
        ...dto,
        timestamp: Date.now(),
      });

      return res;
    } catch (error) {
      handleErrorCatch(error);
    }
  }

  async updateBlogPost(
    id: string,
    authorId: string,
    dto: Partial<CreateBlogPostDto>
  ) {
    try {
      const res = await this.blogPostsRepo.findOneAndUpdate(
        { id, authorId },
        dto
      );
      return res;
    } catch (error) {
      handleErrorCatch(error);
    }
  }

  async getBlogPost(id: string, authorId: string) {
    try {
      const res = await this.blogPostsRepo.findOne({
        id,
        authorId,
      });
      return res;
    } catch (error) {
      handleErrorCatch(error);
    }
  }

  async getAllBlogPost(authorId: string, query) {
    try {
      const res = await this.blogPostsRepo.findPaginated(
        query.size,
        query.page,
        { authorId },
        {
          questions: true,
        }
      );
      return res;
    } catch (error) {
      handleErrorCatch(error);
    }
  }

  async deleteBlogPost(id: string, authorId: string) {
    try {
      const res = await this.blogPostsRepo.findOneAndDelete({ id, authorId });
      return res;
    } catch (error) {
      handleErrorCatch(error);
    }
  }

  async isUserOwnerOfBlogPost(id: string, authorId: string) {
    try {
      const res = await this.blogPostsRepo.findOne({ id, authorId });
      if (!res) {
        throw new BadRequestException("user not owner of blog post or blog post deleted");
      }
      return res;
    } catch (error) {
      throw error;
    }
  }
}
