# Bank Components

This directory contains components for managing and displaying question banks in the Evalify application.

## Components Overview

### AddFromBank

The main component for displaying and selecting question banks. Features include:

- **Search functionality** - Search banks by name or course code
- **Filtering** - Filter banks by semester
- **Sorting** - Sort by name, course code, semester, questions count, topics count, or creation date
- **View modes** - Switch between card view and table view
- **Responsive design** - Works well on desktop and mobile devices
- **Loading states** - Skeleton loaders while data is being fetched
- **Empty states** - Helpful messages when no banks are found

#### Props

```typescript
type Props = {}; // No props required - manages its own state
```

#### Usage

```typescript
import { AddFromBank } from '@/components/bank';

function QuestionCreationPage() {
  return (
    <div>
      <AddFromBank />
    </div>
  );
}
```

### BankCard

A card component for displaying individual bank information with enhanced styling.

#### Props

```typescript
type Props = {
  bank: BankSchema;
  colorClass?: string;
  onSelect?: (bank: BankSchema) => void;
};
```

#### Features

- **Gradient header** with course code
- **Statistics display** showing questions and topics count
- **Creation date** formatting
- **Click handler** for bank selection
- **Customizable colors** via colorClass prop
- **Responsive design**

#### Usage

```typescript
import { BankCard } from '@/components/bank';

function BanksList() {
  const handleBankSelect = (bank) => {
    console.log('Selected bank:', bank);
  };

  return (
    <BankCard
      bank={bankData}
      colorClass="bg-gradient-to-br from-blue-500 to-purple-600"
      onSelect={handleBankSelect}
    />
  );
}
```

### BankTable

A table component for displaying banks in a tabular format with sorting capabilities.

#### Props

```typescript
interface BankTableProps {
  banks: BankSchema[];
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  getColorForBank: (bankId: string) => string;
  onSelectBank?: (bank: BankSchema) => void;
}
```

#### Features

- **Sortable columns** - Click column headers to sort
- **Visual sort indicators** - Shows current sort field and direction
- **Color-coded course codes** - Each bank gets a unique color
- **Responsive design** - Adapts to different screen sizes
- **Action buttons** - Select bank functionality

### BankSearchFilters

A reusable component for search and filter controls.

#### Props

```typescript
interface BankSearchFiltersProps {
  semesters: string[];
  semesterFilter: string;
  setSemesterFilter: (value: string) => void;
  sortField: SortField;
  sortOrder: SortOrder;
  setSortField: (field: SortField) => void;
  setSortOrder: (order: SortOrder) => void;
}
```

#### Features

- **Semester filtering** - Dropdown to filter by semester
- **Sort controls** - Dropdown with multiple sort options
- **Visual indicators** - Shows current sort direction

### SearchInput

A enhanced input component with built-in search icon and clear functionality.

#### Props

```typescript
interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  showClearButton?: boolean;
}
```

#### Features

- **Search icon** - Built-in search icon on the left
- **Clear button** - X button to clear the input (when value exists)
- **Customizable** - All standard input props supported

## Types

### SortField

```typescript
type SortField =
  | "name"
  | "courseCode"
  | "semester"
  | "questions"
  | "topics"
  | "created_at";
```

### SortOrder

```typescript
type SortOrder = "asc" | "desc";
```

### ViewMode

```typescript
type ViewMode = "cards" | "table";
```

## Styling

All components use:

- **Tailwind CSS** for styling
- **shadcn/ui** components as base
- **Dark mode support** with appropriate color schemes
- **Responsive design** with mobile-first approach
- **Smooth transitions** and hover effects

## Data Management

- Uses **React Query** (`@tanstack/react-query`) for data fetching
- Implements **memoization** with `useMemo` and `useCallback` for performance
- **Error handling** with proper loading and empty states
- **TypeScript** for type safety

## Performance Optimizations

- **Memoized filtering and sorting** to prevent unnecessary re-calculations
- **Efficient color generation** using hash-based algorithm
- **Optimized re-renders** with proper React hooks usage
- **Skeleton loading** for better perceived performance

## Accessibility

- **Keyboard navigation** support
- **Screen reader** friendly with proper ARIA labels
- **Focus management** for interactive elements
- **Semantic HTML** structure

## Migration from Old Component

The original `AddFromBank` component was enhanced with:

1. **Search functionality** - Added search input with real-time filtering
2. **Advanced filtering** - Semester-based filtering
3. **Multiple sort options** - Sort by various fields with ascending/descending order
4. **View modes** - Switch between cards and table view
5. **Better UX** - Loading states, empty states, and better visual feedback
6. **Modular architecture** - Separated concerns into reusable components
7. **Enhanced styling** - Better colors, spacing, and responsive design
8. **Performance improvements** - Memoization and efficient rendering

## Future Enhancements

Potential improvements that could be added:

- **Pagination** for large datasets
- **Advanced search** with multiple criteria
- **Bulk operations** (select multiple banks)
- **Favoriting/bookmarking** banks
- **Recent banks** section
- **Export functionality** for bank data
- **Drag and drop** reordering
