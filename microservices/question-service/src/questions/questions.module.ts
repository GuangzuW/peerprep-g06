import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { QuestionsController } from "./questions.controller";
import { QuestionsService } from "./questions.service";
import { questionsProviders } from "./questions.providers";

@Module({
  imports: [DatabaseModule],
  controllers: [QuestionsController],
  providers: [QuestionsService, ...questionsProviders],
})
export class QuestionsModule {}
