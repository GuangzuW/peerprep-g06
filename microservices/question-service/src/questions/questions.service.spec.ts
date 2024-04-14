import { Test, TestingModule } from "@nestjs/testing";
import { Model } from "mongoose";
import { QuestionsService } from "./questions.service";
import { Question } from "./schemas/question.schema";

const mockQuestion = {
  title: "Fundamentals of Machine Learning",
  description:
    "A beginner-friendly introduction to machine learning, covering basic concepts and algorithms.",
  categories: ["AI", "Machine Learning", "Data Science"],
  complexity: "Beginner",
};
describe("QuestionsService", () => {
  let mockService: QuestionsService;
  let mockQuestionModel: Model<Question>;

  const questionArray = [
    {
      title: "Understanding Async/Await",
      description:
        "Detailed explanation of asynchronous programming with async/await in JavaScript.",
      categories: ["JavaScript", "Asynchronous"],
      complexity: "Intermediate",
    },
    {
      title: "Best Practices for REST API",
      description: "Key principles and practices for designing RESTful APIs.",
      categories: ["API Design", "Best Practices"],
      complexity: "Advanced",
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionsService,
        {
          provide: "QUESTION_MODEL",
          useValue: {
            new: jest.fn().mockResolvedValue(mockQuestion),
            constructor: jest.fn().mockResolvedValue(mockQuestion),
            find: jest.fn(),
            create: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    mockService = module.get<QuestionsService>(QuestionsService);
    mockQuestionModel = module.get<Model<Question>>("QUESTION_MODEL");
  });

  it("should be defined", () => {
    expect(mockService).toBeDefined();
  });

  it("should return all questions", async () => {
    jest.spyOn(mockQuestionModel, "find").mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(questionArray),
    } as any);
    const question = await mockService.findAll();
    expect(question).toEqual({ items: questionArray });
  });

  it("should insert a new question", async () => {
    jest.spyOn(mockQuestionModel, "create").mockImplementationOnce(() =>
      Promise.resolve({
        title: "Fundamentals of Machine Learning",
        description:
          "A beginner-friendly introduction to machine learning, covering basic concepts and algorithms.",
        categories: ["AI", "Machine Learning", "Data Science"],
        complexity: "Beginner",
      } as any),
    );
    const newQuestion = await mockService.create({
      title: "Fundamentals of Machine Learning",
      description:
        "A beginner-friendly introduction to machine learning, covering basic concepts and algorithms.",
      categories: ["AI", "Machine Learning", "Data Science"],
      complexity: "Beginner",
    });
    expect(newQuestion).toEqual(mockQuestion);
  });
});
