import { usersDataProvider } from "./usersDataProvider";
import { questionsDataProvider } from "./questionsDataProvider";
import { matchingsDataProvider } from "./matchingsDataProvider";

export const dataProviders = {
  default: usersDataProvider,
  questions: questionsDataProvider,
  matchings: matchingsDataProvider,
};
