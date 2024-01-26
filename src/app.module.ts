import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./libs/db/DatabaseModule";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { AuthModule } from "./modules/auth/auth.module";
import { HealthModule } from "./modules/health";
import { BlogModule } from "./modules/blog-post/BlogPostModule";

@Module({
  imports: [DatabaseModule, HealthModule, AuthModule, BlogModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
