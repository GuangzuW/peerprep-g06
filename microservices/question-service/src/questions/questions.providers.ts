import { Connection } from "mongoose";
import { QuestionSchema } from "./schemas/question.schema";

export const questionsProviders = [
  {
    provide: "QUESTION_MODEL",
    useFactory: (connection: Connection) =>
      connection.model("QuestionModel", QuestionSchema),
    inject: ["DATABASE_CONNECTION"],
  },
];
