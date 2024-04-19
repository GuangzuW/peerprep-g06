import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { HttpModule } from "@nestjs/axios";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth.guard";

@Module({
  imports: [HttpModule],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
