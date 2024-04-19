import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { QuestionDto } from "./dto/question.dto";

@Injectable()
export class ExternalQuestionsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async getAllQuestions(): Promise<QuestionDto[]> {
    const getAllQuestionsEndpoint = this.configService.get<string>(
      "API_QUESTIONS_GET_ALL_ENDPOINT",
    );
    if (!getAllQuestionsEndpoint) {
      throw new Error(
        "API_QUESTIONS_GET_ALL_ENDPOINT environment variable not configured.",
      );
    }

    const response = await this.httpService.axiosRef.get(
      getAllQuestionsEndpoint,
    );
    return response.data as QuestionDto[];
  }
}
