import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server } from "ws";
import * as Y from "yjs";
import * as yUtils from "y-websocket/bin/utils";
import { MongodbPersistence } from "y-mongodb-provider";
import { ConfigService } from "@nestjs/config";

@WebSocketGateway({ path: "/ws/yjs" })
export class YjsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private configService: ConfigService) {
    const connectionString = this.configService.get<string>("DB_CLOUD_URI");
    if (!connectionString) {
      throw new Error("DB_CLOUD_URI environment variable not configured.");
    }
    setMongodbPersistence(connectionString);
  }

  handleConnection(client: any, request: Request, ..._args: any[]): void {
    const docName = (request.url.split("?")[1] ?? "default").replace(/^\//, "");
    const revisedDocName = `collaborationmodels_${docName}`;
    yUtils.setupWSConnection(client, request, { docName: revisedDocName });
  }

  handleDisconnect(): void {}
}

function setMongodbPersistence(connectionString: string) {
  const mdb = new MongodbPersistence(connectionString, {
    collectionName: "transactions",
    flushSize: 100,
    multipleCollections: true,
  });
  yUtils.setPersistence({
    provider: mdb,
    bindState: async (docName, ydoc) => {
      const persistedYdoc = await mdb.getYDoc(docName);
      const newUpdates = Y.encodeStateAsUpdate(ydoc);
      mdb.storeUpdate(docName, newUpdates);
      Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(persistedYdoc));
      ydoc.on("update", async (update) => {
        mdb.storeUpdate(docName, update);
      });
    },
    writeState: async (_docName, _ydoc) => {
      await Promise.resolve();
    },
  });
}
