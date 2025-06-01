import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface SelectBoxProps {
  id: string;
  label: string;
  placeholder: string;
  options: Option[];
  value?: string;
  onValueChange: (value: string) => void;
  allowMultiple?: boolean;
  allowCustom?: boolean;
  onAddCustomOption?: (option: Option) => void;
  className?: string;
}

const SelectBox: React.FC<SelectBoxProps> = ({
  id,
  label,
  placeholder,
  options,
  value,
  onValueChange,
  allowCustom = false,
  onAddCustomOption,
  className = "",
}) => {
  const [customValue, setCustomValue] = useState("");

  const handleAddCustom = () => {
    if (customValue.trim() && onAddCustomOption) {
      const newOption: Option = {
        value: customValue.trim().toLowerCase().replace(/\s+/g, "-"),
        label: customValue.trim(),
      };
      onAddCustomOption(newOption);
      setCustomValue("");
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCustom();
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
      )}

      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id={id}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {allowCustom && (
        <div className="flex gap-2">
          <Input
            type="text"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add custom option"
          />
          <Button type="button" onClick={handleAddCustom} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default SelectBox;
