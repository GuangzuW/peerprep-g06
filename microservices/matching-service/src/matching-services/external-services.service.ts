import { Injectable, HttpException, HttpStatus, ConsoleLogger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { ConfigService } from "@nestjs/config";

/**
 * Service for interacting with external services.
 */
@Injectable()
export class ExternalServicesService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  /**
   * Fetches user data from the user service.
   * @param userId - The ID of the user.
   * @returns A promise that resolves to the user data.
   * @throws HttpException if the request fails.
   */
  async fetchUserData(userId: string): Promise<any> {
    const userServiceUrl = this.configService.get("USER_SERVICE_URL");
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${userServiceUrl}/users/${userId}`),
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "Error fetching user data:",
        error.response?.data || error.message,
      ); // Log the error

      if (error.response) {
        throw new HttpException(
          `Failed to fetch user data: ${error.response.data?.message || "Unknown error"}`,
          error.response.status || HttpStatus.BAD_GATEWAY,
        );
      } else {
        throw new HttpException(
          "Failed to fetch user data due to an unexpected error",
          HttpStatus.BAD_GATEWAY,
        );
      }
    }
  }

  /**
   * Fetches question data from the question service.
   * @param questionId - The ID of the question.
   * @returns A promise that resolves to the question data.
   * @throws HttpException if the request fails.
   */
  async fetchQuestionData(questionId: string): Promise<any> {
    const questionServiceUrl = this.configService.get("QUESTION_SERVICE_URL");
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${questionServiceUrl}/questions/${questionId}`),
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "Error fetching question data:",
        error.response?.data || error.message,
      );

      if (error.response) {
        throw new HttpException(
          `Failed to fetch question data: ${error.response.data?.message || "Unknown error"}`,
          error.response.status || HttpStatus.BAD_GATEWAY,
        );
      } else {
        throw new HttpException(
          "Failed to fetch question data due to an unexpected error",
          HttpStatus.BAD_GATEWAY,
        );
      }
    }
  }

  /**
   * Fetches questions based on the specified criteria.
   * @param category - The category of the questions.
   * @param difficulty - The difficulty level of the questions.
   * @returns A promise that resolves to the matching questions.
   * @throws HttpException if the request fails.
   */
  async fetchQuestionByCriteria(
    category: string,
    difficulty: string,
  ): Promise<any> {
    const questionServiceUrl = this.configService.get("QUESTION_SERVICE_URL");
    try {
      console.log("Fetching questions by criteria:", category, difficulty);
      console.log(`${questionServiceUrl}/questions/search`);
      const response = await firstValueFrom(
        this.httpService.get(`${questionServiceUrl}/questions/search`, {
          params: { category, difficulty },
        }),
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "Error fetching questions by criteria:",
        error.response?.data || error.message,
      );

      if (error.response) {
        throw new HttpException(
          `Failed to fetch questions by criteria: ${error.response.data?.message || "Unknown error"}`,
          error.response.status || HttpStatus.BAD_GATEWAY,
        );
      } else {
        throw new HttpException(
          "Failed to fetch questions by criteria due to an unexpected error",
          HttpStatus.BAD_GATEWAY,
        );
      }
    }
  }
}
