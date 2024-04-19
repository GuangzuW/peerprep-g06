import { defineConfig } from "./defineConfig";

if (!import.meta.env.VITE_USER_SERVICE_ENDPOINT) {
  throw new Error("VITE_USER_SERVICE_ENDPOINT environment variable not configured.");
}

if (!import.meta.env.VITE_QUESTION_SERVICE_ENDPOINT) {
  throw new Error("VITE_QUESTION_SERVICE_ENDPOINT environment variable not configured.");
}

export const appConfig = defineConfig({
  userServiceEndpoint: import.meta.env.VITE_USER_SERVICE_ENDPOINT,
  questionServiceEndpoint: import.meta.env.VITE_QUESTION_SERVICE_ENDPOINT,
  matchingsServiceEndpoint: import.meta.env.VITE_MATCHING_SERVICE_ENDPOINT,
});
