import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { QuestionsController } from "./questions.controller";
import { QuestionsService } from "./questions.service";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { UpdateQuestionDto } from "./dto/update-question.dto";
import { Question } from "./schemas/question.schema";

describe("Questions Controller", () => {
  let controller: QuestionsController;
  let service: QuestionsService;
  let response: MockResponse;

  const createQuestionDto: CreateQuestionDto = {
    title: "Best Practices for REST API",
    description: "Key principles and practices for designing RESTful APIs.",
    categories: ["API Design"],
    complexity: "Advanced",
  };

  const updateQuestionDto: UpdateQuestionDto = {
    title: "Best Practices for REST API",
    description: "Key principles and practices for designing RESTful APIs.",
    categories: ["API Design"],
    complexity: "Advanced",
  };

  const mockQuestion: Partial<Question> = {
    title: "Best Practices for REST API",
    description: "Key principles and practices for designing RESTful APIs.",
    categories: ["API Design"],
    complexity: "Advanced",
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionsController],
      providers: [
        {
          provide: QuestionsService,
          useValue: {
            create: jest.fn().mockResolvedValue(createQuestionDto),
            findAll: jest.fn().mockResolvedValue({
              items: [
                {
                  title: "Understanding Async/Await",
                  description:
                    "Detailed explanation of asynchronous programming with async/await in JavaScript.",
                  categories: ["JavaScript", "Asynchronous"],
                  complexity: "Intermediate",
                },
                {
                  title: "Best Practices for REST API",
                  description:
                    "Key principles and practices for designing RESTful APIs.",
                  categories: ["API Design", "Best Practices"],
                  complexity: "Advanced",
                },
                {
                  title: "Fundamentals of Machine Learning",
                  description:
                    "A beginner-friendly introduction to machine learning, covering basic concepts and algorithms.",
                  categories: ["AI", "Machine Learning", "Data Science"],
                  complexity: "Beginner",
                },
              ],
            }),
            findAllCategories: jest
              .fn()
              .mockResolvedValue(["category1", "category2"]),
            findOne: jest.fn((id: string) => {
              const question = {
                title: "Understanding Async/Await",
                description:
                  "Detailed explanation of asynchronous programming with async/await in JavaScript.",
                categories: ["JavaScript", "Asynchronous"],
                complexity: "Intermediate",
              };
              return id !== "unknown" ? question : null;
            }),
            update: jest.fn((id: string) => id !== "unknown"),
            remove: jest.fn((id: string) => id !== "unknown"),
          },
        },
      ],
    }).compile();

    controller = module.get<QuestionsController>(QuestionsController);
    service = module.get<QuestionsService>(QuestionsService);
    response = new MockResponse();
  });

  describe("create()", () => {
    it("should create a new question and return it", async () => {
      expect(await controller.create(createQuestionDto)).toEqual(mockQuestion);
      expect(service.create).toHaveBeenCalledWith(createQuestionDto);
    });
  });

  describe("findAll()", () => {
    it("should get an array of questions", async () => {
      await controller.findAll(response as unknown as Response);
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response.json()).toEqual([
        {
          title: "Understanding Async/Await",
          description:
            "Detailed explanation of asynchronous programming with async/await in JavaScript.",
          categories: ["JavaScript", "Asynchronous"],
          complexity: "Intermediate",
        },
        {
          title: "Best Practices for REST API",
          description:
            "Key principles and practices for designing RESTful APIs.",
          categories: ["API Design", "Best Practices"],
          complexity: "Advanced",
        },
        {
          title: "Fundamentals of Machine Learning",
          description:
            "A beginner-friendly introduction to machine learning, covering basic concepts and algorithms.",
          categories: ["AI", "Machine Learning", "Data Science"],
          complexity: "Beginner",
        },
      ]);
    });
  });

  describe("findAllCategories()", () => {
    it("should get an array of categories", async () => {
      expect(await controller.findAllCategories()).toEqual([
        "category1",
        "category2",
      ]);
    });
  });

  describe("findOne()", () => {
    it("should get a existing question", async () => {
      await controller.findOne(response as unknown as Response, "existing");
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response.json()).toEqual({
        title: "Understanding Async/Await",
        description:
          "Detailed explanation of asynchronous programming with async/await in JavaScript.",
        categories: ["JavaScript", "Asynchronous"],
        complexity: "Intermediate",
      });
    });

    it("should not get a unknown question", async () => {
      await controller.findOne(response as unknown as Response, "unknown");
      expect(response.statusCode).toEqual(HttpStatus.NOT_FOUND);
    });
  });

  describe("update()", () => {
    it("should update a existing question", async () => {
      await controller.update(
        response as unknown as Response,
        "existing",
        updateQuestionDto,
      );
      expect(response.statusCode).toEqual(HttpStatus.OK);
    });

    it("should not update a unknown question", async () => {
      await controller.update(
        response as unknown as Response,
        "unknown",
        updateQuestionDto,
      );
      expect(response.statusCode).toEqual(HttpStatus.NOT_FOUND);
    });
  });

  describe("remove()", () => {
    it("should delete a existing question", async () => {
      await controller.remove(response as unknown as Response, "existing");
      expect(response.statusCode).toEqual(HttpStatus.OK);
    });

    it("should not delete a unknown question", async () => {
      await controller.remove(response as unknown as Response, "unknown");
      expect(response.statusCode).toEqual(HttpStatus.NOT_FOUND);
    });
  });
});

class MockResponse {
  mockStatus: any;
  mockBody: any;

  get statusCode() {
    return this.mockStatus ?? HttpStatus.OK;
  }

  header() {
    return this;
  }

  status(code: any) {
    this.mockStatus = code;
    return this;
  }

  send(body?: any) {
    this.mockBody = body;
  }

  json() {
    return this.mockBody;
  }
}
