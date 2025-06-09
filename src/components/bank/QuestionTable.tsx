import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Question } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";

export default function QuestionTable({
  questions,
  selectedIds = [],
  onSelectionChange,
}: {
  questions: Question[];
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
}) {
  const toggleSelect = (id: string) => {
    if (!onSelectionChange) return;
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((_id) => _id !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (!onSelectionChange) return;
    if (selectedIds.length === questions.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(questions.map((q) => q.id));
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Checkbox
              checked={
                selectedIds.length === questions.length && questions.length > 0
              }
              onCheckedChange={handleSelectAll}
              aria-label="Select all questions"
            />
          </TableHead>
          <TableHead>#</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Difficulty</TableHead>
          <TableHead>Marks</TableHead>
          <TableHead>Topic</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {questions.map((q, idx) => (
          <TableRow key={q.id}>
            <TableCell>
              <Checkbox
                checked={selectedIds.includes(q.id)}
                onCheckedChange={() => toggleSelect(q.id)}
                aria-label={`Select question ${idx + 1}`}
              />
            </TableCell>
            <TableCell>{idx + 1}</TableCell>
            <TableCell>{q.description}</TableCell>
            <TableCell>{q.type}</TableCell>
            <TableCell>{q.difficulty}</TableCell>
            <TableCell>{q.marks}</TableCell>
            <TableCell>{q.topic}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
