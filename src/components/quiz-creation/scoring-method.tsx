"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

type ScoringMethodProps = {
  data: {
    method: "Standard" | "Weighted";
    pointsPerQuestion: number;
    penalizeWrongAnswers: boolean;
    penaltyAmount: number;
  };
  updateData: (data: ScoringMethodProps["data"]) => void;
};

export function ScoringMethod({ data, updateData }: ScoringMethodProps) {
  const handleChange = (field: string, value: unknown) => {
    updateData({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="scoring-method">Scoring Method</Label>
          <Select
            value={data.method}
            onValueChange={(value: "Standard" | "Weighted") =>
              handleChange("method", value)
            }
          >
            <SelectTrigger id="scoring-method">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Standard">
                Standard (Fixed points per question)
              </SelectItem>
              <SelectItem value="Weighted">
                Weighted (Different points per question)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {data.method === "Standard" && (
          <div className="space-y-2">
            <Label htmlFor="points-per-question">Points per Question</Label>
            <Input
              id="points-per-question"
              type="number"
              min={1}
              value={data.pointsPerQuestion}
              onChange={(e) =>
                handleChange(
                  "pointsPerQuestion",
                  Number.parseInt(e.target.value) || 1,
                )
              }
            />
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <Label htmlFor="penalize-wrong-answers" className="cursor-pointer">
            Penalize Wrong Answers
          </Label>
          <Switch
            id="penalize-wrong-answers"
            checked={data.penalizeWrongAnswers}
            onCheckedChange={(checked) =>
              handleChange("penalizeWrongAnswers", checked)
            }
          />
        </div>

        {data.penalizeWrongAnswers && (
          <div className="space-y-2 ml-6">
            <Label htmlFor="penalty-amount">Penalty Amount</Label>
            <Input
              id="penalty-amount"
              type="number"
              min={0}
              step={0.1}
              value={data.penaltyAmount}
              onChange={(e) =>
                handleChange(
                  "penaltyAmount",
                  Number.parseFloat(e.target.value) || 0,
                )
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
