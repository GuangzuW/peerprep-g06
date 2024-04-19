import dataProvider from "@refinedev/simple-rest";
import { appConfig } from "../config";
import { axiosInstance } from "../axios";

export const matchingsDataProvider = dataProvider(appConfig.questionService.endpoint, axiosInstance);
