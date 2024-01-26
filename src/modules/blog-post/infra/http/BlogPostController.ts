import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { BlogPostService } from "../../application/BlogPostService";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { CreateBlogPostDto } from "../../dto/CreateBlogPost.dto";
import { CurrentUser } from "src/libs/common/decorators/current-user.decorator";
import { User } from "src/modules/auth/users/model/user.model";

@Controller("blog")
export class BlogController {
  constructor(private readonly blogPostService: BlogPostService) {}

  @Post("/")
  @UseGuards(JwtAuthGuard)
  async createBlogPost(
    @Body() dto: CreateBlogPostDto,
    @CurrentUser() user: User
  ) {
    dto.authorId = user.id;
    const res = await this.blogPostService.createBlogPost(dto);
    return res;
  }

  @Get("/")
  @UseGuards(JwtAuthGuard)
  async getAllQuiz(@Query() query, @CurrentUser() user: User) {
    const res = await this.blogPostService.getAllBlogPost(user.id, query);
    return res;
  }

  @Get("/:blogId")
  @UseGuards(JwtAuthGuard)
  async getQuiz(@Param("blogId") blogId: string, @CurrentUser() user: User) {
    const res = await this.blogPostService.getBlogPost(blogId, user.id);
    return res;
  }

  @Delete("/:blogId")
  @UseGuards(JwtAuthGuard)
  async deleteQuiz(@Param("blogId") blogId: string, @CurrentUser() user: User) {
    const res = await this.blogPostService.deleteBlogPost(blogId, user.id);
    return res;
  }

  @Put("/:blogId")
  @UseGuards(JwtAuthGuard)
  async updateQuiz(
    @Param("blogId") blogId: string,
    @Body() dto: Partial<CreateBlogPostDto>,
    @CurrentUser() user: User
  ) {
    return this.blogPostService.updateBlogPost(blogId, user.id, dto);
  }
}
