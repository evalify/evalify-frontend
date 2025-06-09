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
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface BaseSelectBoxProps {
  id: string;
  label: string;
  placeholder: string;
  options: Option[];
  allowCustom?: boolean;
  onAddCustomOption?: (option: Option) => void;
  className?: string;
}

interface SingleSelectBoxProps extends BaseSelectBoxProps {
  allowMultiple?: false;
  value?: string;
  onValueChange: (value: string) => void;
}

interface MultipleSelectBoxProps extends BaseSelectBoxProps {
  allowMultiple: true;
  value?: string[];
  onValueChange: (value: string[]) => void;
}

type SelectBoxProps = SingleSelectBoxProps | MultipleSelectBoxProps;

const SelectBox: React.FC<SelectBoxProps> = ({
  id,
  label,
  placeholder,
  options,
  value,
  onValueChange,
  allowMultiple = false,
  allowCustom = false,
  onAddCustomOption,
  className = "",
}) => {
  const [customValue, setCustomValue] = useState("");
  const [validationError, setValidationError] = useState("");

  const validateCustomInput = (input: string): string => {
    const trimmedInput = input.trim();

    if (!trimmedInput) {
      return "Input cannot be empty";
    }

    // Generate the transformed value to check for duplicates
    const transformedValue = trimmedInput
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // collapse non-alphanumerics to hyphens
      .replace(/^-+|-+$/g, ""); // trim leading/trailing hyphens

    // Check if transformed value would be empty after transformation
    if (!transformedValue) {
      return "Input contains only special characters";
    }

    // Check if option already exists in the options list (by label or transformed value)
    const optionExists = options.some(
      (option) =>
        option.label.toLowerCase() === trimmedInput.toLowerCase() ||
        option.value === transformedValue,
    );

    if (optionExists) {
      return "Option already exists";
    }

    // For multiple selection, also check if the value is already selected
    if (
      allowMultiple &&
      Array.isArray(value) &&
      value.includes(transformedValue)
    ) {
      return "Option is already selected";
    }

    return "";
  };

  const handleAddCustom = () => {
    const error = validateCustomInput(customValue);
    setValidationError(error);

    if (!error && onAddCustomOption) {
      const trimmedValue = customValue.trim();
      const newOption: Option = {
        value: trimmedValue
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-") // collapse non-alphanumerics to hyphens
          .replace(/^-+|-+$/g, ""), // trim leading/trailing hyphens
        label: trimmedValue,
      };

      onAddCustomOption(newOption);
      setCustomValue("");
    }
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setCustomValue(newValue);

    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCustom();
    }
  };

  const handleSingleValueChange = (newValue: string) => {
    if (!allowMultiple) {
      (onValueChange as (value: string) => void)(newValue);
    }
  };

  const handleMultipleValueChange = (newValue: string) => {
    if (allowMultiple) {
      const currentValues = Array.isArray(value) ? value : [];

      if (currentValues.includes(newValue)) {
        // If value is already selected, remove it
        const updatedValues = currentValues.filter((v) => v !== newValue);
        (onValueChange as (value: string[]) => void)(updatedValues);
      } else {
        // If value is not selected, add it
        const updatedValues = [...currentValues, newValue];
        (onValueChange as (value: string[]) => void)(updatedValues);
      }
    }
  };

  const removeSelectedValue = (valueToRemove: string) => {
    if (allowMultiple && Array.isArray(value)) {
      const updatedValues = value.filter((v) => v !== valueToRemove);
      (onValueChange as (value: string[]) => void)(updatedValues);
    }
  };

  const getSelectedLabel = (selectedValue: string): string => {
    const option = options.find((opt) => opt.value === selectedValue);
    return option?.label || selectedValue;
  };

  const getPlaceholderText = (): string => {
    if (allowMultiple && Array.isArray(value) && value.length > 0) {
      return `${value.length} item${value.length === 1 ? "" : "s"} selected`;
    }
    return placeholder;
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
      )}

      {allowMultiple ? (
        <div className="space-y-2">
          <Select onValueChange={handleMultipleValueChange}>
            <SelectTrigger id={id}>
              <SelectValue placeholder={getPlaceholderText()} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center justify-between w-full">
                    <span>{option.label}</span>
                    {Array.isArray(value) && value.includes(option.value) && (
                      <span className="ml-2 text-primary">✓</span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Display selected items */}
          {Array.isArray(value) && value.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {value.map((selectedValue) => (
                <div
                  key={selectedValue}
                  className="flex items-center bg-secondary px-2 py-1 rounded-md text-sm"
                >
                  <span>{getSelectedLabel(selectedValue)}</span>
                  <button
                    type="button"
                    className="ml-2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
                    onClick={() => removeSelectedValue(selectedValue)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <Select
          value={typeof value === "string" ? value : ""}
          onValueChange={handleSingleValueChange}
        >
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
      )}

      {allowCustom && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="text"
              value={customValue}
              onChange={handleCustomInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Add custom option"
              className={
                validationError ? "border-red-500 focus:ring-red-500" : ""
              }
            />
            <Button type="button" onClick={handleAddCustom} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {validationError && (
            <p className="text-sm text-red-500">{validationError}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectBox;
