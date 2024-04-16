import { Document } from "mongoose";

export interface MatchingServices extends Document {
  email: string;
  readonly difficulty: string;
  readonly category: string;
}
