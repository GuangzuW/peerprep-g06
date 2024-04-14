import { Processor, Process } from "@nestjs/bull";
import { InjectQueue } from "@nestjs/bull";
import { Job, Queue } from "bull";
import { MatchingServicesService } from "./matchingservices.service";
import { ExternalServicesService } from "./external-services.service";
import { EventsGateway } from './EventGateway';

/**
 * Processor consumer class for matching services.
 * This class handles the processing of jobs in the matching services queue.
 */
@Processor("process")
export class ProcessConsumer {
  /**
   * Constructor for ProcessConsumer class.
   * @param msQueue The queue for processing jobs.
   * @param matchingServicesService The service for matching services.
   * @param externalServices The service for external services.
   */
  constructor(
    @InjectQueue("process") private readonly msQueue: Queue,
    private readonly matchingServicesService: MatchingServicesService,
    private readonly externalServices: ExternalServicesService,
    private readonly eventsGateway: EventsGateway,
  ) {
    this.setupListeners();
  }

  /**
   * Sets up event listeners for the queue.
   */
  private setupListeners(): void {
    this.msQueue.on("completed", (job, result) => {
      console.log(`Job completed: ${job.id} with result: ${result}`);
    });

    this.msQueue.on("failed", (job, error) => {
      console.error(`Job failed: ${job.id} with error: ${error.message}`);
    });
  }

  /**
   * Handles the processing of a new job in the queue.
   * @param newJob The new job to be processed.
   */
  @Process("process")
  async handleMatching(newJob: Job) {
    console.log("Processing new job for matching:", newJob.id, newJob.data);
    await this.attemptToMatchJob(newJob, 60000); // 60000 ms = 1 minute
  }

  /**
   * Attempts to match a job with another waiting job.
   * If a matching job is found, it pairs the services and removes the jobs from the queue.
   * If no matching job is found, it marks the job as failed.
   * @param newJob The new job to be matched.
   * @param delay The delay in milliseconds before failing the job.
   */
  private async attemptToMatchJob(newJob: Job, delay: number) {
    let matchingJob = await this.findMatchingJob(newJob);

    if (!matchingJob) {
      console.log(
        `No matching job found immediately for job ${newJob.id}. Waiting for ${delay}ms before failing.`,
      );

      await new Promise((resolve) => setTimeout(resolve, delay));

      matchingJob = await this.findMatchingJob(newJob);

      if (!matchingJob) {
        console.log(
          `No matching job found after waiting for job ${newJob.id}. Marking job as failed.`,
        );

        await newJob.moveToFailed({
          message: "No matching job found within the wait period.",
        });
        return;
      }
    }

    const matchedQuestion = await this.externalServices.fetchQuestionByCriteria(
      matchingJob.data.category,
      matchingJob.data.difficulty,
    );
    console.log(
      "Found a matching job and a question based on criteria:",
      matchingJob.id,
      matchedQuestion.id,
    );
    
    this.eventsGateway.notifyMatchFound({
      jobId: newJob.id,
      matchedJobId: matchingJob.id,
      questionId: matchedQuestion.id,
    });


    await this.matchingServicesService.pairServices(
      newJob.data,
      matchingJob.data,
      matchedQuestion,
    );

    await newJob.moveToCompleted();
    await matchingJob.moveToCompleted();
    console.log("Jobs paired and removed from queue.");

  }

  /**
   * Finds a matching job for the given job in the queue.
   * @param job The job to find a matching job for.
   * @returns The matching job if found, otherwise null.
   */
  private async findMatchingJob(job: Job): Promise<Job | null> {
    const waitingJobs = await this.msQueue.getWaiting();
    return (
      waitingJobs.find(
        (waitingJob) =>
          waitingJob.id !== job.id &&
          waitingJob.data.category === job.data.category &&
          waitingJob.data.difficulty === job.data.difficulty,
      ) || null
    );
  }
}
