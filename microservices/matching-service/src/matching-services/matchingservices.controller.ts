import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { CreateMatchingServicesDto } from "./dto/create-matching-services.dto";
import { UpdateMatchingServicesDto } from "./dto/update-matching-services.dto";
import { MatchingServicesService } from "./matchingservices.service";
import { MatchingService } from "./schemas/matchingservices.schema";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";

@Controller("matching-services")
export class MatchingServicesController {
  constructor(
    private readonly matchingServicesService: MatchingServicesService,
    @InjectQueue("process") private readonly msQueue: Queue,
  ) {}

  /**
   * Creates a new matching service.
   * @param createMatchingServicesDto - The data for creating the matching service.
   * @returns The created matching service.
   */
  @Post()
  async create(@Body() createMatchingServicesDto: CreateMatchingServicesDto) {
    try {
      await this.msQueue.add("process", { ...createMatchingServicesDto });
    } catch (error) {
      if (error.message !== "Job already exists") {
        throw error;
      }
    }
    return this.matchingServicesService.create(createMatchingServicesDto);
  }

  /**
   * Retrieves all matching services.
   * @returns A promise that resolves to an array of matching services.
   */
  @Get()
  async findAll(): Promise<MatchingService[]> {
    return this.matchingServicesService.findAll();
  }

  /**
   * Retrieves a matching service by its ID.
   * @param id - The ID of the matching service.
   * @returns A promise that resolves to the matching service, or null if not found.
   */
  @Get(":id")
  async findOne(@Param("id") id: string): Promise<MatchingService | null> {
    return this.matchingServicesService.findOne(id);
  }

  /**
   * Updates a matching service.
   * @param id - The ID of the matching service to update.
   * @param updateDto - The data for updating the matching service.
   * @returns A promise that resolves to the updated matching service, or null if not found.
   */
  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() updateDto: UpdateMatchingServicesDto,
  ): Promise<MatchingService | null> {
    return this.matchingServicesService.update(id, updateDto);
  }

  /**
   * Deletes a matching service by its ID.
   * @param id - The ID of the matching service to delete.
   */
  @Delete(":id")
  async delete(@Param("id") id: string) {
    return this.matchingServicesService.delete(id);
  }

  /**
   * Deletes all matching services.
   */
  @Delete()
  async deleteAll() {
    return this.matchingServicesService.removeAll();
  }
}
