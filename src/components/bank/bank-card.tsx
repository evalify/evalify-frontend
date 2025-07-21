"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { BankSchema } from "@/repo/bank/bank";
import { Badge } from "../ui/badge";
import { FileQuestion, Hash, Calendar } from "lucide-react";

type Props = {
  bank: BankSchema;
  colorClass?: string;
  onSelect?: (bank: BankSchema) => void;
};

export function BankCard({ bank, colorClass, onSelect }: Props) {
  const defaultColorClass =
    "bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 text-white";

  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] dark:hover:shadow-lg/25 overflow-hidden"
      onClick={() => onSelect?.(bank)}
    >
      {/* Header with gradient background */}
      <div
        className={`h-24 flex items-center justify-center p-4 ${colorClass || defaultColorClass}`}
      >
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-1">
            {bank.courseCode}
          </div>
          <div className="text-sm text-white/90">Question Bank</div>
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold line-clamp-2">
          {bank.name}
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <Badge variant="secondary" className="ml-auto flex-shrink-0">
            <Calendar className="mr-1 h-3 w-3" />
            Sem {bank.semester}
          </Badge>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <FileQuestion className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-medium">{bank.questions}</p>
              <p className="text-xs text-muted-foreground">Questions</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <Hash className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-medium">{bank.topics}</p>
              <p className="text-xs text-muted-foreground">Topics</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default BankCard;
