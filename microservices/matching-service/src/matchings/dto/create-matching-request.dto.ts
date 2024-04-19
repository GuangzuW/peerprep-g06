import { Type } from "class-transformer";
import { ArrayNotEmpty, MaxDate } from "class-validator";

/**
 * Data transfer object for creating matching request.
 */
export class CreateMatchingRequestDto {
  /**
   * The categories of the matching request.
   */
  @ArrayNotEmpty({ message: "Categories must not be empty." })
  readonly categories: string[];

  /**
   * The complexities of the matching.
   * @example Easy
   */
  @ArrayNotEmpty({ message: "Complexities must not be empty." })
  readonly complexities: string[];

  @Type(() => Date)
  @MaxDate(() => new Date())
  readonly requestedAt: Date;
}
