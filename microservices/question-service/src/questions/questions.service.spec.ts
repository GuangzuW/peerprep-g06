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
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            updateOne: jest.fn(),
            deleteOne: jest.fn(),
            countDocuments: jest.fn(),
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

  it("should find all categories", async () => {
    jest.spyOn(mockQuestionModel, "find").mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce([
        { categories: ["API", "REST"] },
        { categories: ["API", "GraphQL"] },
        { categories: ["REST"] }
      ]),
    } as any);
    const categories = await mockService.findAllCategories();
    expect(categories).toEqual(["API", "GraphQL", "REST"]);
  });

  it("should find a single question by ID", async () => {
    const questionData = { title: "Question Title", _id: "123" };
    jest.spyOn(mockQuestionModel, "findOne").mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(questionData),
    } as any);
    const question = await mockService.findOne("123");
    expect(question).toEqual(questionData);
  });

  it("should update a question", async () => {
    jest.spyOn(mockQuestionModel, "updateOne").mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce({ matchedCount: 1 }),
    } as any);
    const result = await mockService.update("123", {
      title: "Updated Title",
      description: "Updated description",
      categories: ["Updated category"],
      complexity: "Updated complexity",
    });
    expect(result).toBe(true);
  });

  it("should remove a question", async () => {
    jest.spyOn(mockQuestionModel, "deleteOne").mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce({ deletedCount: 1 }),
    } as any);
    const result = await mockService.remove("123");
    expect(result).toBe(true);
  });

  it("should handle pagination in findAll", async () => {
    jest.spyOn(mockQuestionModel, "countDocuments").mockResolvedValue(5);
    jest.spyOn(mockQuestionModel, "find").mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValueOnce(["item1", "item2"]),
    } as any);
    const page = await mockService.findAll(0, 2);
    expect(page).toEqual({ items: ["item1", "item2"], total: 5 });
  });
});
