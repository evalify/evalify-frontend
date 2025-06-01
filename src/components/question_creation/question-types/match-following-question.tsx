"use client";
import React from "react";
import { TiptapEditor } from "@/components/rich-text-editor/editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, GripVertical } from "lucide-react";

interface MatchItem {
  id: string;
  leftText: string;
  rightText: string;
}

interface MatchFollowingQuestionProps {
  question: string;
  matchItems: MatchItem[];
  explanation?: string;
  showExplanation: boolean;
  onQuestionChange: (question: string) => void;
  onMatchItemsChange: (items: MatchItem[]) => void;
  onExplanationChange: (explanation: string) => void;
  onShowExplanationChange: (show: boolean) => void;
}

const MatchFollowingQuestion: React.FC<MatchFollowingQuestionProps> = ({
  question,
  matchItems,
  explanation = "",
  showExplanation,
  onQuestionChange,
  onMatchItemsChange,
  onExplanationChange,
  onShowExplanationChange,
}) => {
  const addMatchItem = () => {
    const newItem: MatchItem = {
      id: `match-${Date.now()}`,
      leftText: "",
      rightText: "",
    };
    onMatchItemsChange([...matchItems, newItem]);
  };

  const removeMatchItem = (itemId: string) => {
    if (matchItems.length > 2) {
      onMatchItemsChange(matchItems.filter((item) => item.id !== itemId));
    }
  };

  const updateMatchItem = (
    itemId: string,
    field: "leftText" | "rightText",
    value: string,
  ) => {
    onMatchItemsChange(
      matchItems.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item,
      ),
    );
  };

  return (
    <div className="space-y-6">
      {/* Question Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Question</CardTitle>
        </CardHeader>
        <CardContent>
          <TiptapEditor
            initialContent={question}
            onUpdate={onQuestionChange}
            className="min-h-[200px]"
          />
        </CardContent>
      </Card>

      {/* Match Items */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Match Pairs</CardTitle>
          <Button
            onClick={addMatchItem}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Pair
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {matchItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No match pairs created yet. Add pairs to create the matching
              exercise.
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="grid grid-cols-2 gap-4 pb-2 border-b">
                <Label className="text-base font-medium">Column A</Label>
                <Label className="text-base font-medium">Column B</Label>
              </div>

              {/* Match Items */}
              <div className="space-y-3">
                {matchItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 p-3 border rounded-lg"
                  >
                    {/* Drag handle */}
                    <div className="flex items-center mt-2 text-muted-foreground cursor-move">
                      <GripVertical className="h-4 w-4" />
                    </div>

                    {/* Match pair inputs */}
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm">{index + 1}. Item A</Label>
                        <Input
                          value={item.leftText}
                          onChange={(e) =>
                            updateMatchItem(item.id, "leftText", e.target.value)
                          }
                          placeholder="Enter left column item"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">
                          {String.fromCharCode(97 + index)}. Item B
                        </Label>
                        <Input
                          value={item.rightText}
                          onChange={(e) =>
                            updateMatchItem(
                              item.id,
                              "rightText",
                              e.target.value,
                            )
                          }
                          placeholder="Enter right column item"
                        />
                      </div>
                    </div>

                    {/* Remove button */}
                    {matchItems.length > 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMatchItem(item.id)}
                        className="text-destructive hover:text-destructive mt-6"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Instructions */}
              <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                <p className="font-medium mb-1">Instructions for students:</p>
                <p>
                  Match each item in Column A with the corresponding item in
                  Column B. Each item should be matched exactly once.
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Preview */}
      {matchItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              {/* Column A */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Column A</Label>
                <div className="space-y-2">
                  {matchItems.map((item, index) => (
                    <div
                      key={`left-${item.id}`}
                      className="p-2 border rounded text-sm"
                    >
                      {index + 1}. {item.leftText || "Enter item text"}
                    </div>
                  ))}
                </div>
              </div>

              {/* Column B (shuffled for preview) */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Column B</Label>
                <div className="space-y-2">
                  {[...matchItems]
                    .sort(() => Math.random() - 0.5)
                    .map((item, index) => (
                      <div
                        key={`right-${item.id}`}
                        className="p-2 border rounded text-sm"
                      >
                        {String.fromCharCode(97 + index)}.{" "}
                        {item.rightText || "Enter item text"}
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-3">
              Note: Column B will be shuffled randomly for students
            </div>
          </CardContent>
        </Card>
      )}

      {/* Explanation Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Explanation (Optional)</CardTitle>
          <div className="flex items-center gap-2">
            <Label htmlFor="show-explanation" className="text-sm">
              Include explanation
            </Label>
            <Switch
              id="show-explanation"
              checked={showExplanation}
              onCheckedChange={onShowExplanationChange}
            />
          </div>
        </CardHeader>
        {showExplanation && (
          <CardContent>
            <TiptapEditor
              initialContent={explanation}
              onUpdate={onExplanationChange}
              className="min-h-[150px]"
            />
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default MatchFollowingQuestion;
