"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { ChevronDownIcon, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  disabled?: boolean;
  emptyMessage?: string;
  maxDisplayedItems?: number;
  showSelectedCount?: boolean;
}

export function MultiSelect({
  options,
  value = [],
  onValueChange,
  placeholder = "Select options...",
  searchPlaceholder = "Search...",
  className,
  disabled,
  emptyMessage = "No options found",
  maxDisplayedItems = 3,
  showSelectedCount = true,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredOptions = React.useMemo(() => {
    if (!searchTerm) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [options, searchTerm]);

  const selectedOptions = options.filter((option) =>
    value.includes(option.value),
  );

  const handleSelect = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onValueChange?.(newValue);
  };

  const handleRemove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newValue = value.filter((v) => v !== optionValue);
    onValueChange?.(newValue);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange?.([]);
  };

  const displayText = React.useMemo(() => {
    if (selectedOptions.length === 0) return placeholder;

    if (selectedOptions.length <= maxDisplayedItems) {
      return selectedOptions.map((option) => option.label).join(", ");
    }

    const displayedItems = selectedOptions.slice(0, maxDisplayedItems);
    const remainingCount = selectedOptions.length - maxDisplayedItems;

    if (showSelectedCount) {
      return `${selectedOptions.length} items selected`;
    }

    return `${displayedItems.map((option) => option.label).join(", ")} +${remainingCount} more`;
  }, [selectedOptions, maxDisplayedItems, placeholder, showSelectedCount]);

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between min-h-9 h-auto py-2",
            !value.length && "text-muted-foreground",
            className,
          )}
          disabled={disabled}
        >
          <div className="flex flex-wrap gap-1 items-center flex-1 min-w-0">
            {selectedOptions.length <= maxDisplayedItems ? (
              selectedOptions.length > 0 ? (
                selectedOptions.map((option) => (
                  <Badge
                    key={option.value}
                    variant="secondary"
                    className="text-xs px-2 py-0.5 gap-1"
                  >
                    {option.label}
                    <X
                      className="h-3 w-3 cursor-pointer hover:bg-destructive/20 hover:text-destructive rounded-full"
                      onClick={(e) => handleRemove(option.value, e)}
                    />
                  </Badge>
                ))
              ) : (
                <span>{placeholder}</span>
              )
            ) : (
              <span className="truncate">
                {showSelectedCount
                  ? `${selectedOptions.length} items selected`
                  : displayText}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 ml-2">
            {selectedOptions.length > 0 && (
              <X
                className="h-4 w-4 cursor-pointer hover:bg-destructive/20 hover:text-destructive rounded-full"
                onClick={handleClear}
              />
            )}
            <ChevronDownIcon className="h-4 w-4 opacity-50" />
          </div>
        </Button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          className={cn(
            "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 w-[var(--radix-popover-trigger-width)] max-h-96 overflow-hidden rounded-md border shadow-md z-50",
          )}
          align="start"
          sideOffset={4}
        >
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8"
                autoFocus
              />
            </div>
          </div>

          <div className="p-1 max-h-[200px] overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    "relative flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                    option.disabled && "pointer-events-none opacity-50",
                  )}
                  onClick={() => !option.disabled && handleSelect(option.value)}
                >
                  <div className="flex items-center space-x-2 flex-1">
                    <Checkbox
                      checked={value.includes(option.value)}
                      disabled={option.disabled}
                      className="h-4 w-4"
                      onCheckedChange={() => {}}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span>{option.label}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
