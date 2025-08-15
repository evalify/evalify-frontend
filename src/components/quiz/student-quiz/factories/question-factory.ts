/**
 * Factory classes for creating question handlers and renderers
 * Implements factory pattern for modular question type management
 */

import React from "react";
import {
  IQuestionHandler,
  IQuestionHandlerFactory,
  IQuestionRendererFactory,
  IQuestionRenderer,
} from "../interfaces/quiz-interfaces";
import {
  TrueFalseHandler,
  MCQHandler,
  MMCQHandler,
  DescriptiveHandler,
  FillUpHandler,
  MatchHandler,
  CodingHandler,
  FileUploadHandler,
} from "../handlers/question-handlers";
import { BlankId, MatchKeyValues } from "../types/quiz-types";

/**
 * Factory for creating question handlers
 */
export class QuestionHandlerFactory implements IQuestionHandlerFactory {
  private static instance: QuestionHandlerFactory;
  private handlers: Map<
    string,
    (data?: BlankId[] | MatchKeyValues) => IQuestionHandler
  > = new Map();

  private constructor() {
    this.registerDefaultHandlers();
  }

  static getInstance(): QuestionHandlerFactory {
    if (!QuestionHandlerFactory.instance) {
      QuestionHandlerFactory.instance = new QuestionHandlerFactory();
    }
    return QuestionHandlerFactory.instance;
  }

  private registerDefaultHandlers(): void {
    this.handlers.set("TRUE_FALSE", () => new TrueFalseHandler());
    this.handlers.set("MCQ", () => new MCQHandler());
    this.handlers.set("MMCQ", () => new MMCQHandler());
    this.handlers.set("DESCRIPTIVE", () => new DescriptiveHandler());
    this.handlers.set("CODING", () => new CodingHandler());
    this.handlers.set("FILE_UPLOAD", () => new FileUploadHandler());

    // Special handlers that need constructor parameters
    this.handlers.set("FILL_UP", (data) => {
      if (Array.isArray(data)) {
        return new FillUpHandler(data as BlankId[]);
      }
      throw new Error("FILL_UP handler requires BlankId[] data");
    });
    this.handlers.set("MATCH", (data) => {
      if (data && !Array.isArray(data)) {
        return new MatchHandler(data as MatchKeyValues);
      }
      throw new Error("MATCH handler requires MatchKeyValues data");
    });
  }

  createHandler(
    questionType: string,
    data?: BlankId[] | MatchKeyValues,
  ): IQuestionHandler | null {
    const handlerFactory = this.handlers.get(questionType);
    if (!handlerFactory) {
      console.warn(`No handler found for question type: ${questionType}`);
      return null;
    }

    try {
      return handlerFactory(data);
    } catch (error) {
      console.error(`Error creating handler for type ${questionType}:`, error);
      return null;
    }
  }

  registerHandler(questionType: string, handler: IQuestionHandler): void {
    this.handlers.set(questionType, () => handler);
  }

  getSupportedTypes(): string[] {
    return Array.from(this.handlers.keys());
  }
}

/**
 * Factory for creating question renderer components
 */
export class QuestionRendererFactory implements IQuestionRendererFactory {
  private static instance: QuestionRendererFactory;
  private renderers: Map<string, React.ComponentType<IQuestionRenderer>> =
    new Map();

  private constructor() {
    // Renderers will be registered when components are created
  }

  static getInstance(): QuestionRendererFactory {
    if (!QuestionRendererFactory.instance) {
      QuestionRendererFactory.instance = new QuestionRendererFactory();
    }
    return QuestionRendererFactory.instance;
  }

  createRenderer(
    questionType: string,
  ): React.ComponentType<IQuestionRenderer> | null {
    const RendererComponent = this.renderers.get(questionType);
    if (!RendererComponent) {
      console.warn(`No renderer found for question type: ${questionType}`);
      return null;
    }

    return RendererComponent;
  }

  registerRenderer(
    questionType: string,
    component: React.ComponentType<IQuestionRenderer>,
  ): void {
    this.renderers.set(questionType, component);
  }

  getSupportedTypes(): string[] {
    return Array.from(this.renderers.keys());
  }
}

/**
 * Question type detector utility
 */
export class QuestionTypeDetector {
  /**
   * Detect question type from question wrapper structure
   */
  static detectTypeFromData(questionWrapper: { type?: string }): string {
    // The type is stored in questionWrapper.type field
    const questionType = questionWrapper.type;

    if (!questionType) {
      return "UNKNOWN";
    }

    switch (questionType.toUpperCase()) {
      case "TRUEFALSE":
      case "TRUE_FALSE":
        return "TRUE_FALSE";
      case "MCQ":
        return "MCQ";
      case "MMCQ":
        return "MMCQ";
      case "DESCRIPTIVE":
        return "DESCRIPTIVE";
      case "FILL_UP":
        return "FILL_UP";
      case "MATCH":
      case "MATCH_THE_FOLLOWING":
        return "MATCH";
      case "CODING":
        return "CODING";
      case "FILE_UPLOAD":
        return "FILE_UPLOAD";
      default:
        console.warn(`Unknown question type: ${questionType}`);
        return "UNKNOWN";
    }
  }

  /**
   * Get question type metadata
   */
  static getTypeMetadata(questionType: string): {
    displayName: string;
    description: string;
    allowsMultipleAnswers: boolean;
    requiresValidation: boolean;
  } {
    const metadata = {
      TRUE_FALSE: {
        displayName: "True/False",
        description: "Boolean question with true or false answer",
        allowsMultipleAnswers: false,
        requiresValidation: true,
      },
      MCQ: {
        displayName: "Multiple Choice",
        description: "Single select from multiple options",
        allowsMultipleAnswers: false,
        requiresValidation: true,
      },
      MMCQ: {
        displayName: "Multiple Select",
        description: "Multiple select from multiple options",
        allowsMultipleAnswers: true,
        requiresValidation: true,
      },
      DESCRIPTIVE: {
        displayName: "Descriptive",
        description: "Text-based answer",
        allowsMultipleAnswers: false,
        requiresValidation: false,
      },
      FILL_UP: {
        displayName: "Fill in the Blanks",
        description: "Fill missing words or phrases",
        allowsMultipleAnswers: true,
        requiresValidation: true,
      },
      MATCH: {
        displayName: "Match the Following",
        description: "Match items from two lists",
        allowsMultipleAnswers: true,
        requiresValidation: true,
      },
      CODING: {
        displayName: "Coding",
        description: "Programming question with code solution",
        allowsMultipleAnswers: false,
        requiresValidation: false,
      },
      FILE_UPLOAD: {
        displayName: "File Upload",
        description: "Upload file as answer",
        allowsMultipleAnswers: false,
        requiresValidation: true,
      },
    };

    return (
      metadata[questionType as keyof typeof metadata] || {
        displayName: "Unknown",
        description: "Unknown question type",
        allowsMultipleAnswers: false,
        requiresValidation: false,
      }
    );
  }
}
