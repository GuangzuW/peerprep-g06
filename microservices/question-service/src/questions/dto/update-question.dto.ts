import { PartialType } from "@nestjs/mapped-types";
import { CreateQuestionDto } from "./create-question.dto";

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {
  title: string;
  description: string;
  categories: string[];
  complexity: string;
}
