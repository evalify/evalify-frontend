"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Copy, Move, Loader2 } from "lucide-react";
import { BankSchema } from "@/repo/bank/bank";
import { MultiSelect, OptionType } from "@/components/ui/multi-select-virtual";

interface CopyMoveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedQuestions: string[];
  currentBankId: string;
  availableBanks: BankSchema[];
  isLoading: boolean;
  onCopyMove: (
    targetBankId: string,
    move: boolean,
    createNewTopic: boolean,
  ) => void;
}

export function CopyMoveDialog({
  open,
  onOpenChange,
  selectedQuestions,
  currentBankId,
  availableBanks,
  isLoading,
  onCopyMove,
}: CopyMoveDialogProps) {
  const [targetBankIds, setTargetBankIds] = useState<string[]>([]);
  const [move, setMove] = useState(false);
  const [createNewTopic, setCreateNewTopic] = useState(false);

  const filteredBanks = availableBanks.filter(
    (bank) => bank.id !== currentBankId,
  );

  // Convert banks to options for MultiSelect
  const bankOptions: OptionType[] = filteredBanks.map((bank) => ({
    value: bank.id,
    label: `${bank.name} (${bank.courseCode} • Semester ${bank.semester})`,
  }));

  const handleSubmit = () => {
    if (targetBankIds.length === 0) return;
    targetBankIds.forEach((bankId) => {
      onCopyMove(bankId, move, createNewTopic);
    });
  };

  const resetForm = () => {
    setTargetBankIds([]);
    setMove(false);
    setCreateNewTopic(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {move ? (
              <Move className="h-5 w-5 text-orange-500" />
            ) : (
              <Copy className="h-5 w-5 text-blue-500" />
            )}
            {move ? "Move" : "Copy"} Questions
          </DialogTitle>
          <DialogDescription>
            {move ? "Move" : "Copy"} {selectedQuestions.length} question
            {selectedQuestions.length === 1 ? "" : "s"} to{" "}
            {targetBankIds.length === 1
              ? "another question bank"
              : targetBankIds.length > 1
                ? `${targetBankIds.length} question banks`
                : "selected question banks"}
            .
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="target-bank">Target Question Banks</Label>
            <MultiSelect
              options={bankOptions}
              selected={targetBankIds}
              onChange={setTargetBankIds}
              placeholder="Select question banks..."
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="move"
                checked={move}
                onCheckedChange={(checked) => setMove(checked as boolean)}
              />
              <Label htmlFor="move" className="text-sm font-medium">
                Move questions (remove from current bank)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="createNewTopic"
                checked={createNewTopic}
                onCheckedChange={(checked) =>
                  setCreateNewTopic(checked as boolean)
                }
              />
              <Label htmlFor="createNewTopic" className="text-sm font-medium">
                Create new topics if they don&apos;t exist
              </Label>
            </div>
          </div>

          {!createNewTopic && (
            <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
              Questions will be added without topics if their topics don&apos;t
              exist in the target bank.
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={targetBankIds.length === 0 || isLoading}
            className="min-w-[100px]"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : move ? (
              "Move"
            ) : (
              "Copy"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
