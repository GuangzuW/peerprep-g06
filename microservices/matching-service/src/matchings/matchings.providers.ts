import { Connection } from "mongoose";
import { MatchingRequestSchema } from "./schemas/matching-request.schema";

export const matchingsProviders = [
  {
    provide: "MATCHING_MODEL",
    useFactory: (connection: Connection) =>
      connection.model("MatchingModel", MatchingRequestSchema),
    inject: ["DATABASE_CONNECTION"],
  },
];
