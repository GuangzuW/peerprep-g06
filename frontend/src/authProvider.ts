import { AuthProvider } from "@refinedev/core";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { appConfig } from "./config";
import { axiosInstance } from "./axios";

export type IIdentity = {
  id: number;
  name: string;
  avatar?: string;
};

type ExtendedJwtPayload = {
  username: string;
  email: string;
  isAdmin: boolean;
} & JwtPayload;

export const TOKEN_KEY = "auth-token";

export const authProvider: AuthProvider = {
  login: async ({ username, email, password }) => {
    if ((username || email) && password) {
      const response = await axiosInstance.post(
        appConfig.userService.loginEndpoint,
        {
          email,
          password
        }
      );
      if (response.status >= 200 && response.status < 300) {
        const accessToken = response.data.accessToken;
        sessionStorage.setItem(TOKEN_KEY, accessToken);
        return {
          success: true,
          redirectTo: "/",
        };
      }
    }

    return {
      success: false,
      error: {
        name: "LoginError",
        message: "Invalid username or password",
      },
    };
  },
  logout: async () => {
    sessionStorage.removeItem(TOKEN_KEY);
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async () => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (token) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (token) {
      const decodedAccessToken = jwtDecode(token ?? "") as ExtendedJwtPayload;
      return {
        isAdmin: decodedAccessToken.isAdmin,
      };
    }
    return null;
  },
  getIdentity: async () => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (token) {
      const decodedAccessToken = jwtDecode(token ?? "") as ExtendedJwtPayload;
      return {
        id: 1,
        name: decodedAccessToken.username,
      } as IIdentity;
    }
    return null;
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },
};
