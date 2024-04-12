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
  };
}
