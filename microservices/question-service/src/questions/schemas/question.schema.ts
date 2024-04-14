import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type QuestionDocument = Document<Question>;

@Schema()
export class Question {
  @Prop({ required: true, unique: true })
  title: string;
  @Prop()
  description: string;
  @Prop()
  categories: [string];
  @Prop()
  complexity: string;
  @Prop({ default: Date.now })
  createdAt: Date;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
