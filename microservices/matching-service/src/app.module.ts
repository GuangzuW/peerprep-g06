import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { BullModule } from "@nestjs/bull";
import { MatchingServicesModule } from "./matching-services/matchingservices.module";
import { ConfigModule, ConfigService } from "@nestjs/config";

/**
 * Represents the main module of the application.
 */
@Module({
  imports: [
    /**
     * Imports the ConfigModule to load configuration variables.
     */
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    /**
     * Imports the MongooseModule to connect to MongoDB database.
     */
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI"),
      }),
      inject: [ConfigService],
    }),
    /**
     * Imports the MatchingServicesModule to provide matching services.
     */
    MatchingServicesModule,
    /**
     * Imports the BullModule to provide job queue functionality using Redis.
     */
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>("REDIS_HOST"),
          port: +configService.get<number>("REDIS_PORT", 6379)!,
          password: configService.get<string>("REDIS_PASS"),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
