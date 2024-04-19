import {
  Processor,
  Process,
  OnQueueFailed,
  OnQueueCompleted,
} from "@nestjs/bull";
import { InjectQueue } from "@nestjs/bull";
import { Job, Queue } from "bull";
import { ExternalQuestionsService } from "../external-services/external-services.questions.service";
import { EventsGateway } from "src/events/events.gateway";
import { QuestionDto } from "src/external-services/dto/question.dto";
import { MatchingService } from "./matchings.service";
import { MatchingRequest } from "./schemas/matching-request.schema";
import * as matchingConstants from "./matchings.constants";
import { ConfigService } from "@nestjs/config";

type ExtendedMatchingRequest = MatchingRequest & {
  uuid: string;
  retries: number;
  matching: MatchingRequest;
};

/**
 * Processor consumer class for matching requests.
 * This class handles the processing of jobs in the matching requests queue.
 */
@Processor(matchingConstants.matchingRequestsQueueName)
export class MatchingsConsumer {
  private questionsCache?: { expireAt: Date; questions: QuestionDto[] } =
    undefined;
  private questionsCacheExpirationTime = 60; // in seconds
  private matchingRequestTimeLimit = 30; // in seconds

  /**
   * Constructor for ProcessConsumer class.
   *
   * @param matchingRequestQueue The queue for processing jobs.
   * @param ExternalQuestionsService The external questions service.
   * @param matchingService The matching service.
   */
  constructor(
    @InjectQueue(matchingConstants.matchingRequestsQueueName)
    private readonly matchingRequestQueue: Queue<ExtendedMatchingRequest>,
    private readonly configService: ConfigService,
    private readonly externalQuestionsService: ExternalQuestionsService,
    private readonly matchingService: MatchingService,
    private readonly eventsGateway: EventsGateway,
  ) {
    const matchingRequestTimeLimitConfig = configService.get<string>(
      "MATCHING_REQUEST_TIME_LIMIT",
    );
    if (matchingRequestTimeLimitConfig) {
      this.matchingRequestTimeLimit = parseInt(matchingRequestTimeLimitConfig);
    }
  }

  @OnQueueCompleted()
  handleMatchingRequestCompleted(
    job: Job<ExtendedMatchingRequest>,
    result: any,
  ) {
    console.log(`Job completed: ${job.data.uuid} with result: ${result}`);
  }

  @OnQueueFailed()
  handleMatchingRequestFailed(job: Job<ExtendedMatchingRequest>, error: Error) {
    console.error(`Job failed: ${job.data.uuid} with error: ${error.message}`);
  }

  /**
   * Handles the processing of a new job in the queue.
   *
   * @param job The new job to be processed.
   */
  @Process(matchingConstants.matchingRequestsQueueName)
  async process(job: Job<ExtendedMatchingRequest>) {
    job.data.requestedAt = new Date(job.data.requestedAt);
    const earliestAcceptableRequestTime =
      this.getEarliestAcceptableRequestTime();
    if (job.data.requestedAt < earliestAcceptableRequestTime) {
      const message = `Job ${job.data.uuid} exceeds maximum allowed time.`;
      job.moveToFailed({ message });
      console.log(message);
      return;
    }

    if (!job.data.retries || job.data.retries === 0) {
      console.log(
        `Processing new job ${job.data.uuid} for matching:`,
        job.data,
      );
    } else {
      console.log(`Retrying job ${job.data.uuid} for matching:`, job.data);
    }

    await this.attemptJobMatching(job);
  }

  /**
   * Attempts to match a job with another waiting job.
   *
   * If a matching job is found, it pairs the services and removes the jobs from the queue.
   * If no matching job is found, it marks the job as failed.
   *
   * @param job The new job to be matched.
   */
  private async attemptJobMatching(job: Job<ExtendedMatchingRequest>) {
    const matchingJob = await this.findMatchingJob(job);
    if (!matchingJob) {
      console.log(
        `No matching job found immediately for job ${job.data.uuid}.`,
      );
      await this.readdJob({
        job,
        delay: 1000,
        errorMessage: "No matching job found.",
      });
      return;
    }

    const sharedCategories = job.data.categories.filter((category) =>
      matchingJob.data.categories.includes(category),
    );
    const sharedComplexities = job.data.complexities.filter((complexity) =>
      matchingJob.data.complexities.includes(complexity),
    );
    const foundQuestion = await this.findMatchingQuestion(
      sharedCategories,
      sharedComplexities,
    );
    if (!foundQuestion) {
      await this.readdJob({
        job,
        delay: 1000,
        errorMessage: "No question found.",
      });
      return;
    }

    const matchingId = crypto.randomUUID().replaceAll("-", "");
    await job.update({
      ...job.data,
      matching: matchingJob.data,
    });
    await matchingJob.update({
      ...matchingJob.data,
      matching: job.data,
    });
    await job.moveToCompleted();
    await matchingJob.moveToCompleted();
    this.eventsGateway.notifyRequestMatched({
      email1: job.data.email,
      email2: matchingJob.data.email,
      matchingId,
      questionId: foundQuestion._id,
    });
    console.log(
      `Job ${job.data.uuid} has been matched with job ${matchingJob.data.uuid} on question ${foundQuestion._id}.`,
    );
  }

  /**
   * Finds a matching job for the given job in the queue.
   *
   * @param job The job to find a matching job for.
   * @returns The matching job if found, otherwise null.
   */
  private async findMatchingJob(
    job: Job<ExtendedMatchingRequest>,
  ): Promise<Job<ExtendedMatchingRequest> | null> {
    const waitingJobs = await this.matchingRequestQueue.getWaiting();
    const findOthers = (
      filter: (waitingJob: Job<ExtendedMatchingRequest>) => boolean,
    ) => {
      const earliestAcceptableRequestTime =
        this.getEarliestAcceptableRequestTime();
      return waitingJobs.find((waitingJob) => {
        return (
          waitingJob.data.email !== job.data.email &&
          new Date(waitingJob.data.requestedAt) >=
            earliestAcceptableRequestTime &&
          filter(waitingJob)
        );
      });
    };

    // Step 1: attempt to match all criteria.
    let found = findOthers(
      (waitingJob) =>
        waitingJob.data.categories.some((category) =>
          job.data.categories.includes(category),
        ) &&
        waitingJob.data.complexities.some((complexity) =>
          job.data.complexities.includes(complexity),
        ),
    );
    if (found) {
      return found;
    }

    // Step 2: attempt to match categories only.
    found = findOthers((waitingJob) =>
      waitingJob.data.categories.some((category) =>
        job.data.categories.includes(category),
      ),
    );
    if (found) {
      return found;
    }

    // Step 3: attempt to match complexities only.
    found = findOthers((waitingJob) =>
      waitingJob.data.complexities.some((complexity) =>
        job.data.complexities.includes(complexity),
      ),
    );
    return found ?? null;
  }

  private async findMatchingQuestion(
    sharedCategories: string[],
    sharedComplexities: string[],
  ): Promise<QuestionDto | null> {
    if (!this.questionsCache || new Date() > this.questionsCache.expireAt) {
      const questions = await this.externalQuestionsService.getAllQuestions();
      this.questionsCache = {
        questions,
        expireAt: new Date(
          new Date().getTime() + this.questionsCacheExpirationTime * 1000,
        ),
      };
    }

    // Step 1：attempt to match all criteria.
    let foundQuestions = this.questionsCache.questions.filter(
      (question) =>
        (sharedCategories.length === 0 ||
          sharedCategories.some((category) =>
            question.categories.includes(category),
          )) &&
        (sharedComplexities.length === 0 ||
          sharedComplexities?.includes(question.complexity)),
    );

    // Step 2: attempt to match categories only.
    if (foundQuestions.length === 0 && sharedCategories.length > 0) {
      foundQuestions = this.questionsCache.questions.filter((question) =>
        sharedCategories.some((category) =>
          question.categories.includes(category),
        ),
      );
    }

    // Step 3: attempt to match complexities only.
    if (foundQuestions.length === 0 && sharedCategories.length > 0) {
      foundQuestions = this.questionsCache.questions.filter((question) =>
        sharedComplexities?.includes(question.complexity),
      );
    }

    if (foundQuestions.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * (foundQuestions.length - 1));
    return foundQuestions[randomIndex];
  }

  private async readdJob({
    job,
    delay,
    errorMessage,
  }: {
    job: Job<ExtendedMatchingRequest>;
    delay: number;
    errorMessage: string;
  }) {
    const matchingRequest = job.data;
    await job.moveToFailed({ message: errorMessage });
    await this.matchingRequestQueue.add(
      matchingConstants.matchingRequestsQueueName,
      { ...matchingRequest, retries: (matchingRequest.retries ?? 0) + 1 },
      { delay },
    );
  }

  private getEarliestAcceptableRequestTime(): Date {
    return new Date(
      new Date().getTime() - this.matchingRequestTimeLimit * 1000,
    );
  }
}
