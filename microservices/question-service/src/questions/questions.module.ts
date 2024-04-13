import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { AuthModule } from "../auth/auth.module";
import { QuestionsController } from "./questions.controller";
import { QuestionsService } from "./questions.service";
import { questionsProviders } from "./questions.providers";

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [QuestionsController],
  providers: [QuestionsService, ...questionsProviders],
})
export class QuestionsModule {}
