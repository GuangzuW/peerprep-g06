import { Body, Controller, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { CreateMatchingRequestDto } from "./dto/create-matching-request.dto";
import * as matchingConstants from "./matchings.constants";

@Controller("matchings")
export class MatchingController {
  constructor(
    @InjectQueue(matchingConstants.matchingRequestsQueueName)
    private readonly matchingRequestQueue: Queue,
  ) {}

  @Post("request")
  async request(
    @Req() request: Request,
    @Body() createMatchingRequestDto: CreateMatchingRequestDto,
  ) {
    const uuid = crypto.randomUUID().replaceAll("-", "");
    const email = (request as any).user.email;
    await this.matchingRequestQueue.add(
      matchingConstants.matchingRequestsQueueName,
      {
        uuid,
        ...createMatchingRequestDto,
        email,
      },
    );
  }

  @Post("cancel")
  async cancel(@Req() request: Request) {
    const email = (request as any).user.email;
    const waitingJobs = await this.matchingRequestQueue.getWaiting();
    const foundJob = waitingJobs.find(
      (waitingJob) => waitingJob.data.email === email,
    );
    if (foundJob) {
      console.log(`Job ${foundJob.data.uuid} is cancelled.`);
      foundJob.remove();
    }
  }
}
