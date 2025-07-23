/**
 * Test the filter transformation logic
 * Run this in your browser console to verify "Any" → null transformation
 */

// Import your Quiz class and types
// import Quiz from '@/repo/quiz/quiz';
// import { QuestionFilters } from '@/types/quiz-types';

// Test filters with "Any" values
const anyFilters = {
  bank: "any",
  topic: "any",
  difficulty: "any",
  questionType: "any",
  courseOutcome: "any",
  bloomsTaxonomy: "any",
  marks: "any",
  numQuestions: "10",
};

// Test filters with specific values
const specificFilters = {
  bank: "cs101",
  topic: "algorithms",
  difficulty: "easy",
  questionType: "mcq",
  courseOutcome: "co1",
  bloomsTaxonomy: "remember",
  marks: "5",
  numQuestions: "15",
};

// Expected transformation results:

console.log('=== Testing "Any" Values Transform to null ===');
console.log("Input filters:", anyFilters);
// Quiz.transformFiltersToDTO(anyFilters) should return:
const expectedAnyDTO = {
  bankId: null, // "any" → null
  topicId: null, // "any" → null
  difficulty: null, // "any" → null
  questionType: null, // "any" → null
  noOfQuestions: 10, // "10" → 10
};

console.log("=== Testing Specific Values Transform to Arrays ===");
console.log("Input filters:", specificFilters);
// Quiz.transformFiltersToDTO(specificFilters) should return:
const expectedSpecificDTO = {
  bankId: ["cs101"], // "cs101" → ["cs101"]
  topicId: ["algorithms"], // "algorithms" → ["algorithms"]
  difficulty: ["EASY"], // "easy" → [Difficulty.EASY]
  questionType: ["MCQ"], // "mcq" → [QuestionTypes.MCQ]
  noOfQuestions: 15, // "15" → 15
};

console.log("Expected DTO for any filters:", expectedAnyDTO);
console.log("Expected DTO for specific filters:", expectedSpecificDTO);

console.log(
  '✅ Your backend will receive null for "Any" filters (meaning all options)',
);
console.log("✅ Your backend will receive arrays for specific filters");

// To test in your actual app:
/*
// 1. Open browser dev tools on your add-from-bank page
// 2. Run this code:

const testFilters = {
  bank: 'any',
  topic: 'any', 
  difficulty: 'any',
  questionType: 'any',
  courseOutcome: 'any',
  bloomsTaxonomy: 'any',
  marks: 'any',
  numQuestions: '10',
};

// This should log the DTO with null values
console.log('DTO sent to backend:', Quiz.transformFiltersToDTO(testFilters));

// Expected output:
// {
//   bankId: null,
//   topicId: null,
//   difficulty: null,
//   questionType: null,
//   noOfQuestions: 10
// }
*/

export {};
