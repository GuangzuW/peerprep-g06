import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";

Injectable();
describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [AuthService, ConfigService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
