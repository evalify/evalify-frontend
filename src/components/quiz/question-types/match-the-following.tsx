"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { cn } from "@/lib/utils";
import {
  MatchTheFollowingAnswer,
  MatchtheFollowingQuestion,
} from "../types/types";
import { useQuiz } from "../quiz-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MatchTheFollowingProps {
  question: MatchtheFollowingQuestion;
}

const DraggableOption = ({ id, text }: { id: string; text: string }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data: { text },
  });

  return (
    <Card
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "p-4 cursor-grab",
        "hover:bg-accent transition-colors duration-200",
        "active:cursor-grabbing select-none",
        "shadow-md hover:shadow-lg transition-shadow duration-200",
        "dark:shadow-slate-900/60 dark:hover:shadow-slate-800/70",
        "transform hover:-translate-y-1 transition-transform duration-200",
        "border border-border hover:border-primary/30 transition-colors",
        "dark:bg-slate-800 dark:hover:bg-slate-700",
        isDragging && "opacity-50",
      )}
    >
      {text}
    </Card>
  );
};

const OptionOverlay = ({ text }: { text: string }) => {
  return (
    <Card
      className={cn(
        "p-4 cursor-grabbing",
        "shadow-2xl",
        "dark:shadow-slate-900/90",
        "scale-105 transform",
        "border-2 border-primary/50",
        "bg-background",
        "dark:bg-slate-800",
        "ring-2 ring-primary/20 ring-offset-2 dark:ring-offset-slate-900",
      )}
    >
      {text}
    </Card>
  );
};

const AnswerSlot = ({
  id,
  keyText,
  keyIndex,
  valueId,
  getValueText,
}: {
  id: string;
  keyText: string;
  keyIndex: number;
  valueId: string | null;
  getValueText: (id: string) => string | null;
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="flex-shrink-0 w-8 text-foreground text-xl font-medium">
        {keyIndex + 1}.
      </div>
      <Card className="flex-shrink-0 w-96 p-4 shadow-sm dark:shadow-slate-900/50 dark:bg-slate-800">
        {keyText}
      </Card>
      <div className="flex-shrink-0 w-8 text-foreground">→</div>
      <div
        ref={setNodeRef}
        className={cn(
          "w-96 p-4 rounded-lg min-h-[56px] transition-all duration-200",
          valueId
            ? "bg-card shadow-sm dark:shadow-slate-900/50 dark:bg-slate-800/70"
            : "border-2 border-dashed border-muted dark:border-slate-600",
          isOver &&
            !valueId &&
            "bg-accent/50 border-primary shadow-md dark:shadow-primary/20 dark:bg-slate-700/70 dark:border-primary/70",
        )}
      >
        {valueId && getValueText(valueId) && (
          <DraggableOption id={valueId} text={getValueText(valueId) || ""} />
        )}
      </div>
    </div>
  );
};

export default function MatchTheFollowingQuestion({
  question,
}: MatchTheFollowingProps) {
  const { matchAnswers, setMatchAnswers } = useQuiz();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeText, setActiveText] = useState<string>("");

  // Add CSS for custom scrollbar only once
  useEffect(() => {
    // Check if the style is already added to avoid duplicates
    const styleId = "match-following-scrollbar-style";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.7);
        }
        
        /* For Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
        }
        
        /* For dark mode */
        @media (prefers-color-scheme: dark) {
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(75, 85, 99, 0.5);
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: rgba(75, 85, 99, 0.7);
          }
          .custom-scrollbar {
            scrollbar-color: rgba(75, 85, 99, 0.5) transparent;
          }
        }
      `;
      document.head.appendChild(style);

      // No need to remove the style on unmount as it's shared
      // We'll keep it in the DOM for reuse
    }
  }, []);

  useEffect(() => {
    const existingAnswers = matchAnswers[question.id] || [];
    const answerMap: Record<string, string> = {};

    existingAnswers.forEach((answer) => {
      Object.entries(answer).forEach(([key, value]) => {
        answerMap[key] = value;
      });
    });

    setAnswers(answerMap);
  }, [question.id, matchAnswers]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);

    if (active.data?.current?.text) {
      setActiveText(active.data.current.text);
    } else {
      const valueItem = question.value.find((v) => v.id === active.id);
      if (valueItem) {
        setActiveText(valueItem.text);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    const draggedOptionId = active.id as string;
    const newAnswers = { ...answers };

    // First, remove the dragged option from any existing assignment
    Object.keys(newAnswers).forEach((key) => {
      if (newAnswers[key] === draggedOptionId) {
        delete newAnswers[key];
      }
    });

    // If dropped over a valid key target, create a new assignment
    if (over) {
      const targetKeyId = over.id as string;
      const isTargetKey = question.key.some((k) => k.id === targetKeyId);

      if (isTargetKey) {
        newAnswers[targetKeyId] = draggedOptionId;
      }
    }

    // Update the state regardless of where the item was dropped
    setAnswers(newAnswers);
    setMatchAnswers(question.id, [newAnswers as MatchTheFollowingAnswer]);
  };

  const handleClearSelections = () => {
    setAnswers({});
    setMatchAnswers(question.id, [{} as MatchTheFollowingAnswer]);
  };

  const getValueText = (valueId: string) => {
    return question.value.find((v) => v.id === valueId)?.text || null;
  };

  const getUnusedOptions = () => {
    const usedOptionIds = Object.values(answers);
    return question.value.filter((v) => !usedOptionIds.includes(v.id));
  };

  return (
    <Card className="mt-6 shadow-md dark:shadow-slate-900/60 dark:bg-slate-900/50 max-h-[85vh] flex flex-col">
      <CardContent className="p-6 overflow-hidden flex flex-col">
        <h2 className="text-2xl font-bold mb-6">{question.question}</h2>

        <div className="flex justify-between items-center mb-4">
          <div></div>
          {Object.keys(answers).length > 0 && (
            <Button
              onClick={handleClearSelections}
              variant="destructive"
              size="sm"
            >
              Clear All Selections
            </Button>
          )}
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToWindowEdges]}
        >
          <div className="mb-8 max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar">
            {question.key.map((keyItem, index) => (
              <AnswerSlot
                key={keyItem.id}
                id={keyItem.id}
                keyText={keyItem.text}
                keyIndex={index}
                valueId={answers[keyItem.id]}
                getValueText={getValueText}
              />
            ))}
          </div>

          <div className="flex flex-wrap gap-4 max-h-[20vh] overflow-y-auto pr-2 custom-scrollbar">
            {getUnusedOptions().map((option) => (
              <div key={option.id} className="w-full sm:w-auto">
                <DraggableOption id={option.id} text={option.text} />
              </div>
            ))}
          </div>

          <DragOverlay>
            {activeId ? <OptionOverlay text={activeText} /> : null}
          </DragOverlay>
        </DndContext>
      </CardContent>
    </Card>
  );
}
