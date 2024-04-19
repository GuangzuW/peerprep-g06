import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BullModule } from "@nestjs/bull";

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>("REDIS_HOST");
        if (!host) {
          throw new Error("REDIS_HOST environment variable not configured.");
        }
        return {
          redis: {
            host,
            port: configService.get<number>("REDIS_PORT") ?? 6379,
            password: configService.get<string>("REDIS_PASS"),
          },
        };
      },
    }),
  ],
})
export class QueueModule {}
