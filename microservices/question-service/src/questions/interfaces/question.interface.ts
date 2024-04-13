import { Document } from "mongoose";

export interface Question extends Document {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly categories: string;
  readonly complexity: string;
}
