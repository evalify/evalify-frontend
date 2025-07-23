## How to Integrate Backend Question Filtering

Your frontend already has "Any" options working perfectly! The issue is that you need to connect them to your backend. Here's how to integrate your backend's `filterBankQuestionsToQuiz` endpoint:

### 1. What You Have Already ✅

Your frontend already implements:
- ✅ "Any" option in all dropdowns (topics, difficulty, question type)
- ✅ Filter state management 
- ✅ UI components with proper "Any" handling

### 2. What You Need to Add 🔧

**Backend Integration Files:**

1. **`/src/types/quiz-types.ts`** - DTO types matching your backend
2. **Updated `/src/repo/quiz/quiz.ts`** - API integration with filter transformation
3. **`/src/hooks/use-question-filters.ts`** - React hook for easy usage

### 3. Key Changes Required 🚀

**Replace Mock Filtering with Backend API:**

In your existing `add-from-bank/[quizId]/page.tsx`, replace this mock filtering:

```tsx
// OLD: Mock filtering (remove this)
const filterQuestions = useCallback(() => {
  let result: Question[] = getQuestionsByBankId(currentBank);
  
  if (filters.topic && filters.topic !== "any") {
    result = result.filter(q => q.topic?.toLowerCase() === filters.topic.toLowerCase());
  }
  // ... more mock filtering
}, [filters]);
```

**With Backend API Call:**

```tsx
// NEW: Backend integration (add this)
import Quiz from '@/repo/quiz/quiz';
import Bank from '@/repo/bank/bank';
import { useQuestionFilters } from '@/hooks/use-question-filters';

export default function AddQuestionsPage() {
  const { quizId } = useParams();
  const { filteredQuestions, loading, error, filterQuestions } = useQuestionFilters();
  
  // Get topics for selected bank
  const { data: bankTopics } = useQuery({
    queryKey: ['bankTopics', filters.bank],
    queryFn: () => Bank.getBankTopics(filters.bank),
    enabled: filters.bank !== 'any',
  });

  // Filter questions when filters change
  useEffect(() => {
    if (quizId && typeof quizId === 'string') {
      filterQuestions(quizId, filters);
    }
  }, [filters, quizId, filterQuestions]);

  // Use filteredQuestions instead of local mock data
  return (
    <div>
      {/* Your existing filter UI works as-is */}
      
      {loading && <div>Loading questions...</div>}
      {error && <div>Error: {error}</div>}
      
      <QuestionPreview
        questions={filteredQuestions} // ← Use backend data
        selectable={true}
        selectedIds={selectedQuestionIds}
        onSelectionChange={handleQuestionSelection}
      />
    </div>
  );
}
```

### 4. How "Any" Values Work 🎯

The magic happens in the `Quiz.transformFiltersToDTO()` method:

```tsx
// Frontend sends "any" → Backend receives null (meaning all options)
{
  bank: "any" → bankId: null,           // All banks
  topic: "any" → topicId: null,         // All topics  
  difficulty: "any" → difficulty: null, // All difficulties
  questionType: "any" → questionType: null, // All question types
}

// Frontend sends specific values → Backend receives arrays
{
  bank: "cs101" → bankId: ["cs101"],
  topic: "algorithms" → topicId: ["topic-uuid"],
  difficulty: "easy" → difficulty: [Difficulty.EASY],
  questionType: "mcq" → questionType: [QuestionTypes.MCQ],
}
```

### 5. Topic ID Resolution 🔧

Since your backend expects topic IDs but frontend might use topic names, the system handles this:

```tsx
// Option 1: If using topic names in frontend
const dto = await Quiz.transformFiltersWithTopicResolution(filters, bankTopics);

// Option 2: If using topic IDs in frontend  
const dto = Quiz.transformFiltersToDTO(filters);
```

### 6. Complete Integration Example 📝

See the example component: `/src/components/quiz/backend-question-filters.tsx`

This shows a complete working example with:
- ✅ Backend API integration
- ✅ "Any" → null transformation  
- ✅ Loading states
- ✅ Error handling
- ✅ Topic ID resolution

### 7. Benefits You Get 🎉

1. **"Any" works perfectly** - Your existing UI doesn't need changes
2. **Real backend data** - No more mock questions
3. **Proper filtering** - Backend handles complex filtering logic
4. **Performance** - Server-side filtering is faster
5. **Consistency** - Same filtering logic as your backend expects

### 8. Quick Migration Steps 📋

1. ✅ Add the new files (already provided)
2. Replace mock `filterQuestions` with `useQuestionFilters` hook  
3. Replace `getQuestionsByBankId` with `filteredQuestions` from hook
4. Add loading/error states to your UI
5. Test that "Any" values send `null` to backend
6. Verify specific values send arrays to backend

Your "Any" dropdown functionality is already perfect - you just need to connect it to the backend! 🚀
