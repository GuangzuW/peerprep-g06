import * as mongoose from "mongoose";

export const QuestionSchema = new mongoose.Schema({
  title: { type: String, unique: true },
  description: String,
  categories: [String],
  complexity: String,
  createdAt: { type: Date, default: Date.now },
});
