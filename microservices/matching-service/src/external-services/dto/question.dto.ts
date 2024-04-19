/**
 * Data transfer object for question.
 */
export class QuestionDto {
  readonly _id: string;
  readonly title: string;
  readonly description: string;
  readonly categories: string[];
  readonly complexity: string;
}
