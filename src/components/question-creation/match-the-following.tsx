"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  MatchTheFollowing,
  MatchItem,
  MatchPair,
} from "./question-types/match-the-following";
import { UpdatePayload } from "./question-types/base-question";
import { QuestionSettings } from "./settings-types/settings-types";
import {
  Plus,
  X,
  GripVertical,
  Link2,
  Save,
  FileText,
  Edit3,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TiptapEditor } from "@/components/rich-text-editor/editor";
import { generateMatchItemId } from "@/components/question-creation/utils/id-generator";

interface CreateMatchTheFollowingProps {
  type: "MATCH_THE_FOLLOWING";
  isEditing: boolean;
  questionId?: string;
  questionData?: MatchTheFollowing;
  settings?: QuestionSettings;
  onSave?: (question: MatchTheFollowing) => void;
}

interface DragItem {
  type: "left" | "right";
  id: string;
  index: number;
}

export default function CreateMatchTheFollowing({
  isEditing,
  questionData,
  settings,
  onSave,
}: CreateMatchTheFollowingProps) {
  const { success } = useToast();
  const [question, setQuestion] = useState<MatchTheFollowing | null>(null);
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<string | null>(null);
  const [editingLeftItemId, setEditingLeftItemId] = useState<string | null>(
    null,
  );
  const [editingRightItemId, setEditingRightItemId] = useState<string | null>(
    null,
  );
  const [isCreatingNewLeftItem, setIsCreatingNewLeftItem] = useState(false);
  const [isCreatingNewRightItem, setIsCreatingNewRightItem] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const dragCounter = useRef(0);

  const createNewQuestion = useCallback(
    (questionText: string = ""): MatchTheFollowing => {
      return {
        type: "MATCH_THE_FOLLOWING",
        question: questionText,
        topicIds: settings?.topicIds || [],
        marks: settings?.marks || 1,
        bloomsTaxonomy: settings?.bloomsTaxonomy || "REMEMBER",
        co: settings?.co || 1,
        difficulty: settings?.difficulty || "MEDIUM",
        negativeMark: settings?.negativeMark || 0,
        keys: [],
        values: [],
        matchPair: [],
      };
    },
    [settings],
  );

  useEffect(() => {
    if (question && onSave) {
      onSave(question);
    }
  }, [question, onSave]);

  useEffect(() => {
    if (questionData && isEditing) {
      setQuestion(questionData);
    }
  }, [questionData, isEditing]);

  useEffect(() => {
    if (settings) {
      setQuestion((prev) => {
        if (!prev) {
          return createNewQuestion();
        }
        return {
          ...prev,
          type: "MATCH_THE_FOLLOWING",
          marks: settings.marks,
          difficulty: settings.difficulty,
          bloomsTaxonomy: settings.bloomsTaxonomy,
          co: settings.co,
          negativeMark: settings.negativeMark,
          topicIds: settings.topicIds,
        };
      });
    }
  }, [settings, createNewQuestion]);

  const updateQuestion = useCallback((updates: UpdatePayload) => {
    setQuestion((prev) => {
      if (!prev) return null;
      return { ...prev, ...updates };
    });
  }, []);

  const addLeftItem = () => {
    setIsCreatingNewLeftItem(true);
    setEditorContent("");
  };

  const addRightItem = () => {
    setIsCreatingNewRightItem(true);
    setEditorContent("");
  };
  const handleSaveItem = () => {
    if (!question || !editorContent.trim()) return;

    if (isCreatingNewLeftItem) {
      const newItem: MatchItem = {
        id: generateMatchItemId(),
        text: editorContent,
      };
      const updatedKeys = [...(question.keys || []), newItem];
      updateQuestion({ keys: updatedKeys });
      setIsCreatingNewLeftItem(false);
    } else if (isCreatingNewRightItem) {
      const newItem: MatchItem = {
        id: generateMatchItemId(),
        text: editorContent,
      };
      const updatedValues = [...(question.values || []), newItem];
      updateQuestion({ values: updatedValues });
      setIsCreatingNewRightItem(false);
    } else if (editingLeftItemId) {
      const updatedKeys = (question.keys || []).map((item) =>
        item.id === editingLeftItemId ? { ...item, text: editorContent } : item,
      );
      updateQuestion({ keys: updatedKeys });
      setEditingLeftItemId(null);
    } else if (editingRightItemId) {
      const updatedValues = (question.values || []).map((item) =>
        item.id === editingRightItemId
          ? { ...item, text: editorContent }
          : item,
      );
      updateQuestion({ values: updatedValues });
      setEditingRightItemId(null);
    }

    setEditorContent("");
  };

  const handleCancelEdit = () => {
    setIsCreatingNewLeftItem(false);
    setIsCreatingNewRightItem(false);
    setEditingLeftItemId(null);
    setEditingRightItemId(null);
    setEditorContent("");
  };

  const handleEditLeftItem = (id: string) => {
    const item = question?.keys?.find((k) => k.id === id);
    if (item) {
      setEditingLeftItemId(id);
      setEditorContent(item.text);
    }
  };

  const handleEditRightItem = (id: string) => {
    const item = question?.values?.find((v) => v.id === id);
    if (item) {
      setEditingRightItemId(id);
      setEditorContent(item.text);
    }
  };

  const removeLeftItem = (id: string) => {
    if (!question) return;
    const updatedKeys = (question.keys || []).filter((item) => item.id !== id);
    const updatedMatchPairs = (question.matchPair || []).filter(
      (pair) => pair.leftPair !== id,
    );
    updateQuestion({ keys: updatedKeys, matchPair: updatedMatchPairs });
  };

  const removeRightItem = (id: string) => {
    if (!question) return;
    const updatedValues = (question.values || []).filter(
      (item) => item.id !== id,
    );
    const updatedMatchPairs = (question.matchPair || [])
      .map((pair) => ({
        ...pair,
        rightPair: pair.rightPair.filter((rightId) => rightId !== id),
      }))
      .filter((pair) => pair.rightPair.length > 0);

    updateQuestion({ values: updatedValues, matchPair: updatedMatchPairs });
  };

  const handleDragStart = (e: React.DragEvent, item: DragItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", "");
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverTarget(targetId);
  };

  const handleDragEnter = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    dragCounter.current++;
    setDragOverTarget(targetId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverTarget(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    dragCounter.current = 0;
    setDragOverTarget(null);

    if (!draggedItem || !question) return;

    if (draggedItem.type === "right") {
      const isRightItemUsed = (question.matchPair || []).some((pair) =>
        pair.rightPair.includes(draggedItem.id),
      );

      if (isRightItemUsed) {
        success("Item already matched", {
          description:
            "This right item is already matched with another left item.",
        });
        setDraggedItem(null);
        return;
      }

      const existingPairIndex = (question.matchPair || []).findIndex(
        (pair) => pair.leftPair === targetId,
      );

      const updatedMatchPairs = [...(question.matchPair || [])];

      if (existingPairIndex >= 0) {
        updatedMatchPairs[existingPairIndex] = {
          leftPair: targetId,
          rightPair: [
            ...updatedMatchPairs[existingPairIndex].rightPair,
            draggedItem.id,
          ],
        };
      } else {
        const newPair: MatchPair = {
          leftPair: targetId,
          rightPair: [draggedItem.id],
        };
        updatedMatchPairs.push(newPair);
      }

      updateQuestion({ matchPair: updatedMatchPairs });
      success("Match created", {
        description: "Successfully linked the items.",
      });
    }

    setDraggedItem(null);
  };

  const removeMatch = (leftId: string, rightId?: string) => {
    if (!question) return;

    if (rightId) {
      const updatedMatchPairs = (question.matchPair || [])
        .map((pair) => {
          if (pair.leftPair === leftId) {
            return {
              ...pair,
              rightPair: pair.rightPair.filter((id) => id !== rightId),
            };
          }
          return pair;
        })
        .filter((pair) => pair.rightPair.length > 0);

      updateQuestion({ matchPair: updatedMatchPairs });
    } else {
      const updatedMatchPairs = (question.matchPair || []).filter(
        (pair) => pair.leftPair !== leftId,
      );
      updateQuestion({ matchPair: updatedMatchPairs });
    }
  };

  const getMatchesForLeftItem = (leftId: string): string[] => {
    if (!question) return [];
    const pair = (question.matchPair || []).find((p) => p.leftPair === leftId);
    return pair ? pair.rightPair : [];
  };

  const isRightItemUsed = (rightId: string): boolean => {
    if (!question) return false;
    return (question.matchPair || []).some((pair) =>
      pair.rightPair.includes(rightId),
    );
  };

  const getRightItemById = (id: string): MatchItem | undefined => {
    if (!question) return undefined;
    return (question.values || []).find((item) => item.id === id);
  };

  if (!question) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Question
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TiptapEditor
            initialContent={question.question}
            onUpdate={(content: string) =>
              updateQuestion({ question: content })
            }
            className="min-h-[200px]"
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Left Items (Questions)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {question?.keys?.map((item, index) => (
            <div key={item.id} className="border rounded-lg p-4">
              {editingLeftItemId === item.id ? (
                <>
                  <div className="flex items-start justify-between mb-3">
                    <Label className="text-sm font-medium">
                      Left Item {index + 1}
                    </Label>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleSaveItem}
                        disabled={!editorContent.trim()}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEdit}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <TiptapEditor
                    initialContent={editorContent}
                    onUpdate={setEditorContent}
                    className="min-h-[80px]"
                  />
                </>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-3">
                    <Label className="text-sm font-medium">
                      Left Item {index + 1}
                    </Label>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditLeftItem(item.id)}
                        disabled={
                          editingLeftItemId !== null ||
                          editingRightItemId !== null ||
                          isCreatingNewLeftItem ||
                          isCreatingNewRightItem
                        }
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => removeLeftItem(item.id)}
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        disabled={
                          editingLeftItemId !== null ||
                          editingRightItemId !== null
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div
                    className="prose prose-sm dark:prose-invert min-h-[40px]"
                    dangerouslySetInnerHTML={{
                      __html:
                        item.text ||
                        '<p class="text-muted-foreground italic">No content</p>',
                    }}
                  />
                </>
              )}
            </div>
          ))}

          {isCreatingNewLeftItem && (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <Label className="text-sm font-medium">
                  Left Item {(question?.keys?.length || 0) + 1}
                </Label>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSaveItem}
                    disabled={!editorContent.trim()}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelEdit}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <TiptapEditor
                initialContent=""
                onUpdate={setEditorContent}
                className="min-h-[80px]"
              />
            </div>
          )}

          {(question?.keys?.length || 0) === 0 && !isCreatingNewLeftItem && (
            <div className="text-center text-muted-foreground py-8 border-2 border-dashed border-border rounded-lg">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-lg font-medium">No left items added yet</p>
              <p className="text-sm">
                Click &ldquo;Add Left Item&rdquo; to create your first left item
              </p>
            </div>
          )}

          <Button
            variant="outline"
            onClick={addLeftItem}
            disabled={
              isCreatingNewLeftItem ||
              editingLeftItemId !== null ||
              editingRightItemId !== null ||
              isCreatingNewRightItem
            }
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Left Item
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GripVertical className="h-5 w-5" />
            Right Items (Answers)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {question?.values?.map((item, index) => (
            <div key={item.id} className="border rounded-lg p-4">
              {editingRightItemId === item.id ? (
                <>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <Label className="text-sm font-medium">
                        Right Item {index + 1}
                      </Label>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleSaveItem}
                        disabled={!editorContent.trim()}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEdit}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <TiptapEditor
                    initialContent={editorContent}
                    onUpdate={setEditorContent}
                    className="min-h-[80px]"
                  />
                </>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <Label className="text-sm font-medium">
                        Right Item {index + 1}
                      </Label>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditRightItem(item.id)}
                        disabled={
                          editingLeftItemId !== null ||
                          editingRightItemId !== null ||
                          isCreatingNewLeftItem ||
                          isCreatingNewRightItem
                        }
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => removeRightItem(item.id)}
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        disabled={
                          editingLeftItemId !== null ||
                          editingRightItemId !== null
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div
                    className="prose prose-sm dark:prose-invert min-h-[40px]"
                    dangerouslySetInnerHTML={{
                      __html:
                        item.text ||
                        '<p class="text-muted-foreground italic">No content</p>',
                    }}
                  />
                </>
              )}
            </div>
          ))}

          {isCreatingNewRightItem && (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-sm font-medium">
                    Right Item {(question?.values?.length || 0) + 1}
                  </Label>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSaveItem}
                    disabled={!editorContent.trim()}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelEdit}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <TiptapEditor
                initialContent=""
                onUpdate={setEditorContent}
                className="min-h-[80px]"
              />
            </div>
          )}

          {(question?.values?.length || 0) === 0 && !isCreatingNewRightItem && (
            <div className="text-center text-muted-foreground py-8 border-2 border-dashed border-border rounded-lg">
              <GripVertical className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-lg font-medium">No right items added yet</p>
              <p className="text-sm">
                Click &ldquo;Add Right Item&rdquo; to create your first right
                item
              </p>
            </div>
          )}

          <Button
            variant="outline"
            onClick={addRightItem}
            disabled={
              isCreatingNewRightItem ||
              editingLeftItemId !== null ||
              editingRightItemId !== null ||
              isCreatingNewLeftItem
            }
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Right Item
          </Button>
        </CardContent>
      </Card>

      {(question?.keys?.length || 0) > 0 &&
        (question?.values?.length || 0) > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5" />
                Create Matches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Drop right items here to create matches
                  </Label>
                  {(question?.keys || []).map((leftItem, index) => {
                    const matchedRightIds = getMatchesForLeftItem(leftItem.id);
                    const matchedRightItems = matchedRightIds
                      .map((id) => getRightItemById(id))
                      .filter((item): item is MatchItem => item !== undefined);

                    return (
                      <div
                        key={leftItem.id}
                        className={`border-2 rounded-lg p-4 transition-colors min-h-[100px] ${
                          dragOverTarget === leftItem.id &&
                          draggedItem?.type === "right"
                            ? "border-primary bg-primary/10"
                            : matchedRightItems.length > 0
                              ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                              : "border-dashed border-gray-300 dark:border-gray-600"
                        }`}
                        onDragOver={(e) => handleDragOver(e, leftItem.id)}
                        onDragEnter={(e) => handleDragEnter(e, leftItem.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, leftItem.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            Left {index + 1}
                          </Badge>
                          {matchedRightItems.length > 0 && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeMatch(leftItem.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>

                        <div
                          className="prose prose-sm dark:prose-invert text-sm mb-3"
                          dangerouslySetInnerHTML={{ __html: leftItem.text }}
                        />

                        {matchedRightItems.length > 0 ? (
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center gap-2 mb-2">
                              <Link2 className="h-3 w-3 text-green-600" />
                              <span className="text-xs text-green-600 font-medium">
                                Matched with:
                              </span>
                            </div>
                            {matchedRightItems.map((matchedItem) => (
                              <div
                                key={matchedItem.id}
                                className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800"
                              >
                                <div className="flex items-start justify-between">
                                  <div
                                    className="prose prose-sm dark:prose-invert text-sm text-green-800 dark:text-green-200 flex-1"
                                    dangerouslySetInnerHTML={{
                                      __html: matchedItem.text,
                                    }}
                                  />
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                      removeMatch(leftItem.id, matchedItem.id)
                                    }
                                    className="text-destructive hover:text-destructive ml-2 flex-shrink-0"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border-dashed border border-gray-300 dark:border-gray-600">
                            <p className="text-xs text-muted-foreground text-center">
                              Drop right items here to create matches
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Drag these items to the left side
                  </Label>
                  {(question?.values || []).map((rightItem, index) => {
                    const isUsed = isRightItemUsed(rightItem.id);

                    return (
                      <div
                        key={rightItem.id}
                        className={`border rounded-lg p-4 transition-colors ${
                          isUsed
                            ? "border-gray-300 bg-gray-100 dark:bg-gray-800 opacity-50 cursor-not-allowed"
                            : "border-border cursor-move hover:border-primary/50 hover:shadow-md"
                        }`}
                        draggable={
                          !isUsed &&
                          editingLeftItemId === null &&
                          editingRightItemId === null &&
                          !isCreatingNewLeftItem &&
                          !isCreatingNewRightItem
                        }
                        onDragStart={(e) =>
                          !isUsed &&
                          handleDragStart(e, {
                            type: "right",
                            id: rightItem.id,
                            index,
                          })
                        }
                      >
                        <div className="flex items-start justify-between mb-2">
                          <Badge
                            variant={isUsed ? "secondary" : "outline"}
                            className="text-xs"
                          >
                            Right {index + 1} {isUsed && "• Used"}
                          </Badge>
                          <GripVertical
                            className={`h-4 w-4 ${isUsed ? "text-gray-400" : "text-muted-foreground"}`}
                          />
                        </div>

                        <div
                          className={`prose prose-sm dark:prose-invert text-sm ${isUsed ? "text-gray-500" : ""}`}
                          dangerouslySetInnerHTML={{ __html: rightItem.text }}
                        />

                        {isUsed && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            This item is already matched
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      {(question?.matchPair?.length || 0) > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              Match Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(question?.matchPair || []).map((pair, index) => {
                const leftItem = (question?.keys || []).find(
                  (k) => k.id === pair.leftPair,
                );

                return (
                  <div
                    key={index}
                    className="p-4 bg-muted/30 rounded-lg border"
                  >
                    <div className="flex items-start gap-4">
                      <Badge variant="outline" className="shrink-0 font-medium">
                        {leftItem?.text
                          ? leftItem.text
                              .replace(/<[^>]*>/g, "")
                              .substring(0, 50) +
                            (leftItem.text.length > 50 ? "..." : "")
                          : "Unknown"}
                      </Badge>
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-muted-foreground text-sm">
                          matches
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {pair.rightPair.map((rightId) => {
                            const rightItem = getRightItemById(rightId);
                            return (
                              <Badge
                                key={rightId}
                                variant="secondary"
                                className="font-normal"
                              >
                                {rightItem?.text
                                  ? rightItem.text
                                      .replace(/<[^>]*>/g, "")
                                      .substring(0, 40) +
                                    (rightItem.text.length > 40 ? "..." : "")
                                  : "Unknown"}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
