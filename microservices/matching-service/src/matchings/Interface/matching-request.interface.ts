import { Document } from "mongoose";

export interface MatchingRequest extends Document {
  readonly email: string;
  readonly categories: string;
  readonly complexities: string;
  readonly requestedAt: Date;
}
