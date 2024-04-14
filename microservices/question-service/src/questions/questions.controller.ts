import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Res,
  ConflictException,
  Query,
} from "@nestjs/common";
import { Response } from "express";
import { MongoError } from "mongodb";
import { Public } from "../auth/decorators/public.decorator";
import { Roles } from "../roles/decorators/roles.decorator";
import { Role } from "../roles/enum/role.enum";
import { QuestionsService } from "./questions.service";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { UpdateQuestionDto } from "./dto/update-question.dto";

@Controller("questions")
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Roles(Role.Admin)
  @Post()
  async create(@Body() createQuestionDto: CreateQuestionDto) {
    try {
      return await this.questionsService.create(createQuestionDto);
    } catch (error) {
      if (error instanceof MongoError && error.code === 11000) {
        throw new ConflictException("Duplicate title.");
      }
      throw error;
    }
  }

  @Public()
  @Get()
  async findAll(
    @Res({ passthrough: true }) res: Response,
    @Query("_start") start?: number,
    @Query("_end") end?: number,
  ) {
    const page = await this.questionsService.findAll(start, end);
    page.total !== undefined
      ? res.header("X-TOTAL-COUNT", page.total.toString()).send(page.items)
      : res.send(page.items);
  }

  @Roles(Role.Admin)
  @Get("categories")
  async findAllCategories() {
    return await this.questionsService.findAllCategories();
  }

  @Public()
  @Get(":id")
  async findOne(
    @Res({ passthrough: true }) res: Response,
    @Param("id") id: string,
  ) {
    const found = await this.questionsService.findOne(id);
    if (!found) {
      res.status(HttpStatus.NOT_FOUND).send();
      return;
    }

    res.status(HttpStatus.OK).send(found);
  }

  @Roles(Role.Admin)
  @Patch(":id")
  async update(
    @Res({ passthrough: true }) res: Response,
    @Param("id") id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    let found;
    try {
      found = await this.questionsService.update(id, updateQuestionDto);
    } catch (error) {
      if (error instanceof MongoError && error.code === 11000) {
        throw new ConflictException("Duplicate title.");
      }
      throw error;
    }

    if (!found) {
      res.status(HttpStatus.NOT_FOUND).send();
      return;
    }

    res.status(HttpStatus.OK).send();
  }

  @Roles(Role.Admin)
  @Delete(":id")
  async remove(
    @Res({ passthrough: true }) res: Response,
    @Param("id") id: string,
  ) {
    const found = await this.questionsService.remove(id);
    if (!found) {
      res.status(HttpStatus.NOT_FOUND).send();
      return;
    }

    res.status(HttpStatus.OK).send();
  }


  @Public()
  @Get('search')
  async search(
    @Res({ passthrough: true }) res: Response,
    @Query('categories') categories: string,
    @Query('complexity') complexity: string,
  ) {
    const results = await this.questionsService.search(categories.split(','), complexity);
    if (results.length === 0) {
      res.status(HttpStatus.NOT_FOUND).send('No questions found matching your criteria');
      return;
    }

    res.status(HttpStatus.OK).send(results);
  }
}
