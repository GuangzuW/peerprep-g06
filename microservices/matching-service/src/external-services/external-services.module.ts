import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { ExternalQuestionsService } from "./external-services.questions.service";

@Module({
  imports: [HttpModule],
  providers: [ExternalQuestionsService],
  exports: [ExternalQuestionsService],
})
export class ExternalServicesModule {}
