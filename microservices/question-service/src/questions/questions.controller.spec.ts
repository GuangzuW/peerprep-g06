import { Test, TestingModule } from "@nestjs/testing";
import { QuestionsController } from "./questions.controller";
import { QuestionsService } from "./questions.service";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { Question } from "./schemas/question.schema";

describe("Questions Controller", () => {
  let controller: QuestionsController;
  let service: QuestionsService;

  const createQuestionDto: CreateQuestionDto = {
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
            findAll: jest.fn().mockResolvedValue([
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
            ]),
            create: jest.fn().mockResolvedValue(createQuestionDto),
          },
        },
      ],
    }).compile();

    controller = module.get<QuestionsController>(QuestionsController);
    service = module.get<QuestionsService>(QuestionsService);
  });

  describe("create()", () => {
    it("should create a new question and return it", async () => {
      expect(await controller.create(createQuestionDto)).toEqual(mockQuestion);
      expect(service.create).toHaveBeenCalledWith(createQuestionDto);
    });
  });
});
