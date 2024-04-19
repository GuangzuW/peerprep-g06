import {
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, WebSocket } from "ws";
import { AuthService } from "../auth/auth.service";

@WebSocketGateway({ path: "/ws" })
export class EventsGateway implements OnGatewayDisconnect {
  private clients: Record<string, WebSocket> = {};

  constructor(private readonly authService: AuthService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage("auth")
  async handleMessage(client: WebSocket, payload: string) {
    const { passed, payload: user } =
      await this.authService.verifyToken(payload);
    const email = user.email;
    this.clients[email] = client;
    client.send(
      JSON.stringify({
        type: "auth",
        data: passed,
      }),
    );
  }

  notifyRequestMatched({
    email1,
    email2,
    matchingId,
    questionId,
  }: {
    email1: string;
    email2: string;
    matchingId: string;
    questionId: string;
  }) {
    this.clients[email1]?.send(
      JSON.stringify({
        type: "request-matched",
        data: { matchingId, questionId },
      }),
    );
    this.clients[email2]?.send(
      JSON.stringify({
        type: "request-matched",
        data: { matchingId, questionId },
      }),
    );
  }

  handleConnection(_client: WebSocket, ..._args: any[]): void {}

  handleDisconnect(client: WebSocket, ..._args: any[]): void {
    let foundEmail = null;
    for (const [email, websocket] of Object.entries(this.clients)) {
      if (client === websocket) {
        foundEmail = email;
        break;
      }
    }
    if (foundEmail) {
      delete this.clients[foundEmail];
    }
  }
}
