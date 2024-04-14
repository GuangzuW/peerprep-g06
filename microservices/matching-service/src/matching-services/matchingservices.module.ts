import { Module } from "@nestjs/common";
import { MatchingServicesController } from "./matchingservices.controller";
import { QueueController } from "./queue.controller";
import { MatchingServicesService } from "./matchingservices.service";
import {
  MatchingService,
  MatchingServicesSchema,
} from "./schemas/matchingservices.schema";
import { getConnectionToken, MongooseModule } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { BullModule } from "@nestjs/bull";
import { ProcessConsumer } from "./matchingservices.processor";
import { HttpModule } from "@nestjs/axios";
import { ExternalServicesService } from "./external-services.service";
import { EventsGateway } from './EventGateway';

/**
 * Represents the module for the matching services in the application.
 * This module is responsible for importing the necessary dependencies,
 * defining the controllers and providers, and configuring the module.
 */
@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: MatchingService.name,
        useFactory: async (connection: Connection) => {
          const schema = MatchingServicesSchema;
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const AutoIncrement = require("mongoose-sequence")(connection);
          schema.plugin(AutoIncrement, { inc_field: "matching_service_id" });
          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
    BullModule.registerQueueAsync({
      name: "process",
    }),
    HttpModule,
  ],
  controllers: [MatchingServicesController, QueueController],
  providers: [
    MatchingServicesService,
    ProcessConsumer,
    ExternalServicesService,
    EventsGateway,
  ],
})
export class MatchingServicesModule {}
