import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { RolesModule } from "./roles/roles.module";
import { MatchingsModule } from "./matchings/matchings.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

/**
 * Represents the main module of the application.
 */
@Module({
  imports: [
    /**
     * Imports the ConfigModule to load configuration variables.
     */
    ConfigModule.forRoot({ isGlobal: true }),
    /**
     * Imports the AuthModule to verify tokens.
     */
    AuthModule,
    /**
     * Imports the RolesModule to verify roles.
     */
    RolesModule,
    /**
     * Imports the MatchingsModule to provide matching services.
     */
    MatchingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
