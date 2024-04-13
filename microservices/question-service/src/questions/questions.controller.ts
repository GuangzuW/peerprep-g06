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
import { QuestionsService } from "./questions.service";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { UpdateQuestionDto } from "./dto/update-question.dto";

@Controller("questions")
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

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

  @Get("categories")
  async findAllCategories() {
    return await this.questionsService.findAllCategories();
  }

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
}
