import { Model } from "mongoose";
import { Inject, Injectable } from "@nestjs/common";
import { Question } from "./interfaces/question.interface";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { UpdateQuestionDto } from "./dto/update-question.dto";

@Injectable()
export class QuestionsService {
  constructor(
    @Inject("QUESTION_MODEL")
    private questionModel: Model<Question>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const createdQuestion = new this.questionModel(createQuestionDto);
    return createdQuestion.save();
  }

  async findAll(): Promise<Question[]> {
    return this.questionModel.find().exec();
  }

  async findAllCategories(): Promise<string[]> {
    const questions: Question[] = await this.questionModel.find().exec();
    const categories = questions.flatMap((question) => question.categories);
    const normalizedCategories = categories
      .filter((x, index, array) => array.indexOf(x) === index)
      .sort();
    return normalizedCategories;
  }

  async findOne(id: string): Promise<Question | null> {
    return this.questionModel.findOne({ _id: id }).exec();
  }

  async update(
    id: string,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<boolean> {
    const updateResult = await this.questionModel
      .updateOne({ _id: id }, updateQuestionDto)
      .exec();
    return updateResult.matchedCount === 1;
  }

  async remove(id: string): Promise<boolean> {
    const deleteResult = await this.questionModel.deleteOne({ _id: id }).exec();
    return deleteResult.deletedCount === 1;
  }
}
