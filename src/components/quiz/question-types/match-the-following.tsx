"use client"

import { useState, useEffect } from "react"
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
} from "@dnd-kit/core"
import { restrictToWindowEdges } from "@dnd-kit/modifiers"
import { cn } from "@/lib/utils"
import { MatchTheFollowingAnswer, MatchtheFollowingQuestion } from "../types/types"
import { useQuiz } from "../quiz-context"

interface MatchTheFollowingProps {
  question: MatchtheFollowingQuestion
}

const DraggableOption = ({ id, text }: { id: string; text: string }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data: { text },
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "p-4 rounded-lg bg-neutral-900 border border-neutral-700 text-white cursor-grab",
        "hover:bg-neutral-800 transition-colors duration-200",
        "active:cursor-grabbing select-none",
        isDragging && "opacity-50",
      )}
    >
      {text}
    </div>
  )
}

const OptionOverlay = ({ text }: { text: string }) => {
  return (
    <div
      className={cn("p-4 rounded-lg bg-neutral-900 border border-neutral-700 text-white cursor-grabbing", "shadow-xl")}
    >
      {text}
    </div>
  )
}

const AnswerSlot = ({
  id,
  keyText,
  keyIndex,
  valueId,
  getValueText,
}: {
  id: string
  keyText: string
  keyIndex: number
  valueId: string | null
  getValueText: (id: string) => string | null
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="flex-shrink-0 w-8 text-white text-xl font-medium">{keyIndex + 1}.</div>
      <div className="flex-shrink-0 w-96 p-4 rounded-lg bg-neutral-900 border border-neutral-700 text-white">
        {keyText}
      </div>
      <div className="flex-shrink-0 w-8 text-white">→</div>
      <div
        ref={setNodeRef}
        className={cn(
          "w-96 p-4 rounded-lg text-white min-h-[56px]",
          valueId ? "bg-neutral-900 border border-neutral-700" : "border-2 border-dashed border-neutral-600",
          isOver && !valueId && "bg-neutral-800 border-neutral-400",
        )}
      >
        {valueId && <DraggableOption id={valueId} text={getValueText(valueId)} />}
      </div>
    </div>
  )
}

export default function MatchTheFollowingQuestion({ question }: MatchTheFollowingProps) {
  const { matchAnswers, setMatchAnswers } = useQuiz();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeText, setActiveText] = useState<string>("");

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
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveId(active.id as string)

    if (active.data?.current?.text) {
      setActiveText(active.data.current.text)
    } else {
      const valueItem = question.value.find((v) => v.id === active.id)
      if (valueItem) {
        setActiveText(valueItem.text)
      }
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (over && active.id !== over.id) {
      const draggedOptionId = active.id as string
      const targetKeyId = over.id as string

      const isTargetKey = question.key.some((k) => k.id === targetKeyId)

      if (isTargetKey) {
        const newAnswers = { ...answers }

        Object.keys(newAnswers).forEach((key) => {
          if (newAnswers[key] === draggedOptionId) {
            delete newAnswers[key]
          }
        })

        newAnswers[targetKeyId] = draggedOptionId

        setAnswers(newAnswers)
        
        setMatchAnswers(question.id, [newAnswers as MatchTheFollowingAnswer])
      }
    }
  }

  const handleClearSelections = () => {
    setAnswers({});
    setMatchAnswers(question.id, [{} as MatchTheFollowingAnswer]);
  }

  const getValueText = (valueId: string) => {
    return question.value.find((v) => v.id === valueId)?.text || null
  }

  const getUnusedOptions = () => {
    const usedOptionIds = Object.values(answers)
    return question.value.filter((v) => !usedOptionIds.includes(v.id))
  }

  return (
    <div className="p-6 rounded-xl bg-black border border-neutral-800 text-white">
      <h2 className="text-2xl font-bold mb-6 font-handwriting">{question.question}</h2>

      <div className="flex justify-between items-center mb-4">
        <div></div>
        {Object.keys(answers).length > 0 && (
          <button 
            onClick={handleClearSelections}
            className="px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Clear All Selections
          </button>
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToWindowEdges]}
      >
        <div className="mb-8">
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

        <div className="flex flex-wrap gap-4">
          {getUnusedOptions().map((option) => (
            <DraggableOption key={option.id} id={option.id} text={option.text} />
          ))}
        </div>

        <DragOverlay>{activeId ? <OptionOverlay text={activeText} /> : null}</DragOverlay>
      </DndContext>

      <div className="mt-6 flex flex-col space-y-2">
        <div className="flex items-center gap-2 text-neutral-400">
          <div className="w-8 h-8 flex items-center justify-center bg-blue-900 text-white rounded">i</div>
          <span>- Drag and Drop the Option to the relevant answer</span>
        </div>
        <div className="flex items-center gap-2 text-neutral-400">
          <div className="w-8 h-8 flex items-center justify-center bg-red-900 text-white rounded">i</div>
          <span>- Use the Clear All Selections button to reset your answers</span>
        </div>
      </div>
    </div>
  )
}