import * as mongoose from "mongoose";
import { ConfigService } from "@nestjs/config";

export const databaseProviders = [
  {
    provide: "DATABASE_CONNECTION",
    inject: [ConfigService],
    useFactory: (configService: ConfigService): Promise<typeof mongoose> => {
      const connectionString = configService.get<string>("DB_CLOUD_URI");
      if (!connectionString) {
        throw new Error("DB_CLOUD_URI environment variable not configured.");
      }
      return mongoose.connect(connectionString);
    },
  },
];
