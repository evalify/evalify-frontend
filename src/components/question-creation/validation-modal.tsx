import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ValidationError {
  field: string;
  message: string;
}

interface ValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  errors: ValidationError[];
}

export default function ValidationModal({
  isOpen,
  onClose,
  errors,
}: ValidationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Validation Failed
          </DialogTitle>
          <DialogDescription>
            Please fix the following issues before saving the question:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {errors.map((error, index) => (
            <div
              key={index}
              className="p-3 bg-destructive/10 border border-destructive/20 rounded-md"
            >
              <p className="text-sm text-destructive font-medium capitalize">
                {error.field}
              </p>
              <p className="text-sm text-muted-foreground">{error.message}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose}>OK</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
