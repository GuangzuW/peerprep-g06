import { usersDataProvider } from "./usersDataProvider";
import { questionsDataProvider } from "./questionsDataProvider";

export const dataProviders = {
  default: usersDataProvider,
  questions: questionsDataProvider,
};
