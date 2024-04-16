import { IsEmail, IsNotEmpty, IsOptional, IsIn } from "class-validator";

enum Difficulty {
  Easy = "easy",
  Medium = "medium",
  Hard = "hard",
}

/**
 * Data transfer object for updating matching services.
 */
export class UpdateMatchingServicesDto {
  /**
   * The email of the matching service.
   * @example example@example.com
   */
  @IsNotEmpty({ message: "Email must not be empty." })
  @IsEmail({}, { message: "Email must be a valid email address." })
  email: string;

  /**
   * The difficulty level of the matching service.
   * @example easy
   */
  @IsNotEmpty({ message: "Difficulty level must not be empty." })
  @IsIn(Object.values(Difficulty), {
    message:
      "Difficulty must be one of the following values: easy, medium, hard.",
  })
  readonly difficulty: string;

  /**
   * The category of the matching service.
   * @example category
   */
  @IsOptional()
  readonly category: string;
}
