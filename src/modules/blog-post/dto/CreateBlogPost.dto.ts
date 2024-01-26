import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateBlogPostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  authorId:string

}