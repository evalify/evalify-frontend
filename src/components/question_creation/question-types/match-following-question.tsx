"use client";
import React from "react";
import { TiptapEditor } from "@/components/rich-text-editor/editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Trash2,
  Plus,
  GripVertical,
  FileText,
  Edit3,
  Shuffle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const { warning } = useToast();
  const [draggedItemId, setDraggedItemId] = React.useState<string | null>(null);
  const [dragOverItemId, setDragOverItemId] = React.useState<string | null>(
    null,
  );

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
    } else {
      warning("Cannot remove item", {
        description: "At least 2 match pairs are required for the exercise.",
        duration: 3000,
      });
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

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItemId(itemId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", itemId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e: React.DragEvent, itemId: string) => {
    e.preventDefault();
    if (draggedItemId && draggedItemId !== itemId) {
      setDragOverItemId(itemId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // Only clear if we're leaving the container, not moving between child elements
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverItemId(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
    setDragOverItemId(null);
  };

  const handleDrop = (e: React.DragEvent, targetItemId: string) => {
    e.preventDefault();
    setDragOverItemId(null);

    if (!draggedItemId || draggedItemId === targetItemId) {
      return;
    }

    const draggedIndex = matchItems.findIndex(
      (item) => item.id === draggedItemId,
    );
    const targetIndex = matchItems.findIndex(
      (item) => item.id === targetItemId,
    );

    if (draggedIndex === -1 || targetIndex === -1) {
      return;
    }

    // Create new array with reordered items
    const newItems = [...matchItems];
    const draggedItem = newItems[draggedIndex];

    // Remove dragged item and insert at new position
    newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, draggedItem);

    onMatchItemsChange(newItems);
    setDraggedItemId(null);
  };

  // Keyboard navigation for accessibility
  const handleKeyDown = (
    e: React.KeyboardEvent,
    itemId: string,
    index: number,
  ) => {
    if (e.key === "ArrowUp" && e.ctrlKey && index > 0) {
      e.preventDefault();
      moveItem(index, index - 1);
    } else if (
      e.key === "ArrowDown" &&
      e.ctrlKey &&
      index < matchItems.length - 1
    ) {
      e.preventDefault();
      moveItem(index, index + 1);
    }
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    const newItems = [...matchItems];
    const item = newItems[fromIndex];
    newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, item);
    onMatchItemsChange(newItems);
  };

  // Helper function to generate scalable labels for Column B
  // Generates: a, b, c, ..., z, aa, ab, ac, ..., az, ba, bb, etc.
  const generateColumnBLabel = (index: number): string => {
    let label = "";
    let currentIndex = index;

    do {
      label = String.fromCharCode(97 + (currentIndex % 26)) + label;
      currentIndex = Math.floor(currentIndex / 26) - 1;
    } while (currentIndex >= 0);

    return label;
  };

  // Memoize the shuffled items for preview to prevent re-shuffling on every render
  const shuffledItems = React.useMemo(() => {
    return [...matchItems].sort(() => Math.random() - 0.5);
  }, [matchItems]);

  return (
    <div className="space-y-6">
      {/* Question Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Question
          </CardTitle>
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
          <CardTitle className="text-lg flex items-center gap-2">
            <Shuffle className="h-5 w-5 text-primary" />
            Match Pairs
          </CardTitle>
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
              <div
                className="space-y-3"
                role="list"
                aria-label="Match pairs list"
              >
                {matchItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex items-start gap-3 p-3 border rounded-lg transition-all ${
                      draggedItemId === item.id
                        ? "opacity-50 scale-95 rotate-1"
                        : dragOverItemId === item.id
                          ? "border-primary bg-primary/5 border-2"
                          : "hover:bg-accent/50"
                    }`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    onDragOver={handleDragOver}
                    onDragEnter={(e) => handleDragEnter(e, item.id)}
                    onDragLeave={handleDragLeave}
                    onDragEnd={handleDragEnd}
                    onDrop={(e) => handleDrop(e, item.id)}
                    onKeyDown={(e) => handleKeyDown(e, item.id, index)}
                    tabIndex={0}
                    role="listitem"
                    aria-label={`Match pair ${index + 1}. Press Ctrl+Arrow keys to reorder.`}
                  >
                    {/* Drag handle */}
                    <div
                      className="flex items-center mt-2 text-muted-foreground cursor-move hover:text-foreground transition-colors"
                      aria-label="Drag handle"
                    >
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
                          {generateColumnBLabel(index)}. Item B
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
                <p className="mt-2 text-xs">
                  <strong>Tip:</strong> Drag and drop items using the grip
                  handle to reorder them, or use Ctrl+Arrow keys for keyboard
                  navigation.
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
                  {shuffledItems.map((item, index) => (
                    <div
                      key={`right-${item.id}`}
                      className="p-2 border rounded text-sm"
                    >
                      {generateColumnBLabel(index)}.
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
          <CardTitle className="text-lg flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-primary" />
            Explanation (Optional)
          </CardTitle>
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
