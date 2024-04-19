import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async verifyToken(
    token: string,
  ): Promise<{ passed: boolean; payload?: any }> {
    const verifyTokenEndpoint = this.configService.get<string>(
      "API_AUTH_VERIFY_TOKEN_ENDPOINT",
    );
    if (!verifyTokenEndpoint) {
      throw new Error(
        "API_AUTH_VERIFY_TOKEN_ENDPOINT environment variable not configured.",
      );
    }

    const response = await this.httpService.axiosRef.get(verifyTokenEndpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 401) {
      return { passed: false };
    }

    return { passed: true, payload: response.data.verifiedUser };
  }
}
