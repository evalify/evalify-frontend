# Evalify Question Types - Frontend Component Documentation

This document outlines all the question types supported by the Evalify platform, their data structures, and requirements for the robust question component that will render questions, show answers, and provide edit/delete functionality.

## Question Types Overview

The Evalify platform supports **8 different question types**, each with unique properties and rendering requirements:

1. **MCQ** - Multiple Choice Question (Single Answer)
2. **MMCQ** - Multiple Multiple Choice Question (Multiple Answers)
3. **TRUE_FALSE** - True/False Question
4. **FILL_UP** - Fill in the Blanks
5. **MATCH_THE_FOLLOWING** - Matching Pairs
6. **DESCRIPTIVE** - Descriptive/Essay Question
7. **FILE_UPLOAD** - File Upload Question
8. **CODING** - Programming/Coding Question

## Common Base Properties

All question types inherit from a base structure with these common properties:

```typescript
interface BaseQuestion {
  id: string;                    // UUID
  question: string;              // Question text
  explanation?: string;          // Answer explanation
  hint?: string;                 // Hint for students
  marks: number;                 // Question marks/points
  bloomsTaxonomy: Taxonomy;      // Bloom's taxonomy level
  co: number;                    // Course outcome
  negativeMark?: number;         // Negative marking
  difficulty: Difficulty;        // Question difficulty
  bank: Bank;                    // Question bank reference
  topics: Topic[];               // Associated topics
}

enum Taxonomy {
  REMEMBER = "REMEMBER",
  UNDERSTAND = "UNDERSTAND", 
  APPLY = "APPLY",
  ANALYSE = "ANALYSE",
  EVALUATE = "EVALUATE",
  CREATE = "CREATE"
}

enum Difficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD"
}

enum QuestionTypes {
  MCQ = "MCQ",
  MMCQ = "MMCQ",
  TRUEFALSE = "TRUEFALSE",
  FILL_UP = "FILL_UP",
  MATCH_THE_FOLLOWING = "MATCH_THE_FOLLOWING",
  DESCRIPTIVE = "DESCRIPTIVE",
  FILE_UPLOAD = "FILE_UPLOAD",
  CODING = "CODING"
}
```

## Question Type Specific Structures

### 1. MCQ (Multiple Choice Question - Single Answer)

```typescript
interface MCQQuestion extends BaseQuestion {
  type: "MCQ";
  options: MCQOption[];
}

interface MCQOption {
  id: string;
  text: string;
  isCorrect: boolean;  // Only ONE option should be true
}
```

**Rendering Requirements:**
- Display radio buttons (single selection)
- Show all options
- In answer view: highlight correct option in green
- Support option shuffling

---

### 2. MMCQ (Multiple Multiple Choice Question - Multiple Answers)

```typescript
interface MMCQQuestion extends BaseQuestion {
  type: "MMCQ";
  options: MCQOption[];
}

interface MCQOption {
  id: string;
  text: string;
  isCorrect: boolean;  // MULTIPLE options can be true
}
```

**Rendering Requirements:**
- Display checkboxes (multiple selection)
- Show all options
- In answer view: highlight all correct options in green
- Support option shuffling

---

### 3. TRUE_FALSE (True/False Question)

```typescript
interface TrueFalseQuestion extends BaseQuestion {
  type: "TRUE_FALSE";
  answer: boolean;
}
```

**Rendering Requirements:**
- Display two radio buttons: "True" and "False"
- In answer view: highlight correct answer
- Simple binary choice interface

---

### 4. FILL_UP (Fill in the Blanks)

```typescript
interface FillUpQuestion extends BaseQuestion {
  type: "FILL_UP";
  strictMatch: boolean;    // Whether to use strict string matching
  llmEval: boolean;        // Whether to use LLM for evaluation
  template?: string;       // Template for the question format
  blanks: Blank[];
}

interface Blank {
  id: string;
  answers: string[];       // Multiple acceptable answers
}
```

**Rendering Requirements:**
- Display question text with input fields for blanks
- Support multiple acceptable answers per blank
- In answer view: show all acceptable answers
- Handle both strict and flexible matching
- Parse template if provided

---

### 5. MATCH_THE_FOLLOWING (Matching Pairs)

```typescript
interface MatchTheFollowingQuestion extends BaseQuestion {
  type: "MATCH_THE_FOLLOWING";
  keys: MatchPair[];
}

interface MatchPair {
  id: string;
  leftPair: string;        // Left side item
  rightPair: string;       // Right side item (correct match)
}
```

**Rendering Requirements:**
- Display two columns: left items and right options
- Allow drag-and-drop or dropdown selection for matching
- Support shuffling of right-side options
- In answer view: show correct pairs with connecting lines/highlights

---

### 6. DESCRIPTIVE (Essay/Descriptive Question)

```typescript
interface DescriptiveQuestion extends BaseQuestion {
  type: "DESCRIPTIVE";
  expectedAnswer?: string;  // Sample/expected answer
  strictness?: number;      // Evaluation strictness (0-1)
  guidelines?: string;      // Evaluation guidelines
}
```

**Rendering Requirements:**
- Display large text area for answer input
- Show word count if needed
- In answer view: show expected answer and guidelines
- Rich text editor support recommended

---

### 7. FILE_UPLOAD (File Upload Question)

```typescript
interface FileUploadQuestion extends BaseQuestion {
  type: "FILE_UPLOAD";
  expectedAnswer?: string;  // Description of expected file
  strictness?: number;      // Evaluation strictness
  guidelines?: string;      // File submission guidelines
}
```

**Rendering Requirements:**
- File upload component with drag-and-drop
- Show accepted file types and size limits
- Display guidelines prominently
- File preview if possible
- In answer view: show expected file description

---

### 8. CODING (Programming Question)

```typescript
interface CodingQuestion extends BaseQuestion {
  type: "CODING";
  driverCode?: string;          // Test driver code
  boilerCode?: string;          // Template/boilerplate code
  functionName?: string;        // Required function name
  returnType?: string;          // Expected return type
  params?: FunctionParam[];     // Function parameters
  testcases?: TestCase[];       // Test cases
  language?: string[];          // Supported languages
  answer?: string;              // Sample solution
}

interface FunctionParam {
  name: string;
  type: string;
  description?: string;
}

interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;        // Whether test case is visible to student
  points: number;
}
```

**Rendering Requirements:**
- Code editor with syntax highlighting
- Language selection dropdown
- Display function signature if provided
- Show visible test cases
- Run code button with results display
- In answer view: show sample solution and all test cases

## Component Action Requirements

### For All Question Types:

1. **Display Mode:**
   - Render question text
   - Show appropriate input elements
   - Display hints if available
   - Show marks allocation

2. **Answer Mode:**
   - Show correct answers highlighted
   - Display explanation if available
   - Show evaluation criteria

3. **Edit Mode:**
   - All fields should be editable
   - Proper validation
   - Save/cancel functionality

4. **Admin Actions:**
   - Edit button → Switch to edit mode
   - Delete button → Confirm and delete
   - Edit Marks button → Quick marks modification
   - Duplicate button (optional)

### Action Buttons Layout:

```typescript
interface QuestionActions {
  onEdit: (questionId: string) => void;
  onDelete: (questionId: string) => void;
  onEditMarks: (questionId: string, newMarks: number) => void;
  onDuplicate?: (questionId: string) => void;
}
```

## Component Props Interface

```typescript
interface QuestionComponentProps {
  question: BaseQuestion;           // Question data
  mode: 'display' | 'answer' | 'edit';
  actions?: QuestionActions;        // Admin actions
  showActions?: boolean;            // Show action buttons
  shuffleOptions?: boolean;         // For MCQ/MMCQ
  onAnswerChange?: (answer: any) => void;  // For answer submission
  readOnly?: boolean;               // Disable interactions
  showExplanation?: boolean;        // Show explanation
  showHint?: boolean;              // Show hints
}
```

## Styling Requirements

### Visual Hierarchy:
- Clear question numbering
- Proper spacing between elements
- Consistent typography
- Action buttons grouped and clearly visible

### Answer Indication:
- ✅ Green highlighting for correct answers
- ❌ Red highlighting for incorrect answers (in review mode)
- Clear visual feedback for user selections

### Responsive Design:
- Mobile-friendly layouts
- Touch-friendly controls for mobile devices
- Proper scaling for different screen sizes

## Implementation Notes

1. **Type Safety:** Use TypeScript discriminated unions for question types
2. **Validation:** Implement proper validation for each question type
3. **Performance:** Lazy load heavy components (code editor, file upload)
4. **Accessibility:** Ensure proper ARIA labels and keyboard navigation
5. **Error Handling:** Graceful handling of malformed question data
6. **Internationalization:** Support for multiple languages if needed

## Example Usage

```typescript
// Render a question component
<QuestionComponent 
  question={questionData}
  mode="display"
  showActions={isAdmin}
  actions={{
    onEdit: handleEdit,
    onDelete: handleDelete,
    onEditMarks: handleEditMarks
  }}
  shuffleOptions={true}
  onAnswerChange={handleAnswerChange}
/>
```

This documentation provides the complete structure needed to implement a robust question rendering component that handles all question types in the Evalify platform.
