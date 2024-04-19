import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { BullModule } from "@nestjs/bull";
import { DatabaseModule } from "../database/database.module";
import { QueueModule } from "../queue/queue.module";
import { ExternalServicesModule } from "../external-services/external-services.module";
import { EventsModule } from "../events/events.module";
import { MatchingController } from "./matchings.controller";
import { MatchingService } from "./matchings.service";
import { matchingsProviders } from "./matchings.providers";
import { MatchingsConsumer } from "./matchings.consumer";
import * as matchingConstants from "./matchings.constants";

/**
 * Represents the module for the matching services in the application.
 *
 * This module is responsible for importing the necessary dependencies,
 * defining the controllers and providers, and configuring the module.
 */
@Module({
  imports: [
    DatabaseModule,
    ExternalServicesModule,
    QueueModule,
    BullModule.registerQueueAsync({
      name: matchingConstants.matchingRequestsQueueName,
    }),
    HttpModule,
    EventsModule,
  ],
  controllers: [MatchingController],
  providers: [MatchingService, ...matchingsProviders, MatchingsConsumer],
})
export class MatchingsModule {}
