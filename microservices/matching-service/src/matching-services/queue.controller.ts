import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
} from "@nestjs/common";
import { Queue } from "bull";
import { InjectQueue } from "@nestjs/bull";

@Controller("queue")
export class QueueController {
  constructor(@InjectQueue("process") private readonly queue: Queue) {}

  /**
   * Retrieves all jobs in the queue.
   * @returns A promise that resolves to an array of jobs and their states.
   */
  @Get()
  async getQueueJobs() {
    const jobs = await this.queue.getJobs([
      "active",
      "completed",
      "failed",
      "waiting",
      "delayed",
      "paused",
    ]);
    return Promise.all(
      jobs.map(async (job) => ({ job, state: await job.getState() })),
    );
  }

  /**
   * Retrieves a specific job from the queue.
   * @param id - The ID of the job to retrieve.
   * @returns A promise that resolves to the job and its state.
   * @throws NotFoundException if the job with the specified ID is not found.
   */
  @Get(":id")
  async getQueueJob(@Param("id") id: string) {
    const job = await this.queue.getJob(id);
    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
    return { job, state: await job.getState() };
  }

  /**
   * Deletes a specific job from the queue.
   * @param id - The ID of the job to delete.
   * @returns A promise that resolves to a message indicating the job has been removed.
   * @throws NotFoundException if the job with the specified ID is not found.
   */
  @Delete(":id")
  async deleteQueueJob(@Param("id") id: string) {
    const job = await this.queue.getJob(id);
    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
    await job.remove();
    return { message: `Job with ID ${id} has been removed` };
  }

  /**
   * Empties the entire queue.
   * @returns A promise that resolves to a message indicating all jobs have been removed.
   */
  @Delete()
  async emptyQueue() {
    await this.queue.empty();
    await this.queue.clean(1000, "failed");
    return { message: "All jobs have been removed from the queue" };
  }
}
