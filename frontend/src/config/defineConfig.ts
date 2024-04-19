import { AppInitialConfig } from "./types";

export function defineConfig(appInitialConfig: AppInitialConfig) {
  return {
    userService: {
      endpoint: appInitialConfig.userServiceEndpoint,
      loginEndpoint: `${appInitialConfig.userServiceEndpoint}/auth/login`,
      listEndpoint: `${appInitialConfig.userServiceEndpoint}/users/all`,
      createEndpoint: `${appInitialConfig.userServiceEndpoint}/users`,
      updateEndpoint: `${appInitialConfig.userServiceEndpoint}/users`,
      readEndpoint: `${appInitialConfig.userServiceEndpoint}/users`,
      deleteEndpoint: `${appInitialConfig.userServiceEndpoint}/users`,
      updatePrivilegeEndpoint: `${appInitialConfig.userServiceEndpoint}/users/update-privilege`,
    },
    questionService: {
      endpoint: appInitialConfig.questionServiceEndpoint,
      questionCategoriesEndpoint: `${appInitialConfig.questionServiceEndpoint}/questions/categories`
    },
    matchingService: {
      endpoint: appInitialConfig.matchingsServiceEndpoint,
      webSocketEndpoint: `ws${appInitialConfig.matchingsServiceEndpoint.slice(4)}/ws`,
      requestEndpoint: `${appInitialConfig.matchingsServiceEndpoint}/matchings/request`,
      cancelEndpoint: `${appInitialConfig.matchingsServiceEndpoint}/matchings/cancel`,
    },
    collaborationService: {
      endpoint: appInitialConfig.collaborationServiceEndpoint,
      yjsWebSocketEndpoint: `ws${appInitialConfig.collaborationServiceEndpoint.slice(4)}/ws/yjs`,
    },
  };
}
