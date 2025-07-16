"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";

export type OptionType = {
  label: string;
  value: string;
};

interface MultiSelectProps {
  options: OptionType[];
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
  placeholder?: string;
  maxHeight?: number;
  estimateSize?: number;
}
function MultiSelect({
  options,
  selected,
  onChange,
  className,
  placeholder = "Select...",
  maxHeight = 160,
  estimateSize,
}: MultiSelectProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const parentRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Use memo to filter options based on input value
  const filteredOptions = React.useMemo(() => {
    if (!inputValue) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase()),
    );
  }, [options, inputValue]);

  // Setup the virtualizer with conditional configuration
  const virtualizerConfig = React.useMemo(() => {
    const baseConfig = {
      count: filteredOptions.length,
      getScrollElement: () => parentRef.current,
      overscan: 10,
    };

    if (estimateSize) {
      return {
        ...baseConfig,
        estimateSize: (): number => estimateSize,
      };
    } else {
      return {
        ...baseConfig,
        estimateSize: (): number => 36, // Fallback estimate
        measureElement: (element: Element): number =>
          element.getBoundingClientRect().height,
      };
    }
  }, [filteredOptions.length, estimateSize]);

  const virtualizer = useVirtualizer(virtualizerConfig);

  // Force recalculation when options or filtered options change
  React.useEffect(() => {
    virtualizer.measure();
  }, [filteredOptions, virtualizer]);

  // Callback handlers with focus management
  const handleSelect = React.useCallback(
    (value: string) => {
      onChange(
        selected.includes(value)
          ? selected.filter((v) => v !== value)
          : [...selected, value],
      );

      // Keep the search box focused after selection
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    },
    [onChange, selected],
  );

  const handleRemove = React.useCallback(
    (value: string) => {
      onChange(selected.filter((v) => v !== value));
    },
    [onChange, selected],
  );

  // Get the currently selected options with their labels
  const selectedOptions = React.useMemo(
    () =>
      selected
        .map((value) => options.find((option) => option.value === value))
        .filter((option): option is OptionType => option !== undefined),
    [selected, options],
  );

  // Reset search when dropdown closes
  React.useEffect(() => {
    if (!open) {
      setInputValue("");
    }
  }, [open]);

  return (
    <div
      className={cn("group w-full rounded-md border border-input", className)}
    >
      {selectedOptions.length > 0 && (
        <div className="flex gap-1 flex-wrap p-2">
          {selectedOptions.map((option) => (
            <Badge
              variant="secondary"
              key={option.value}
              className="mr-1"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(option.value);
              }}
            >
              {option.label}
              <button
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleRemove(option.value);
                  }
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => handleRemove(option.value)}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      <Command shouldFilter={false}>
        <CommandInput
          ref={inputRef}
          placeholder={placeholder}
          value={inputValue}
          onValueChange={setInputValue}
          onFocus={() => setOpen(true)}
        />
        <CommandList className="max-h-[var(--cmdk-list-height)] overflow-hidden">
          <div
            ref={parentRef}
            className="overflow-y-auto"
            style={{ height: maxHeight, maxHeight: maxHeight }}
          >
            {filteredOptions.length === 0 ? (
              <CommandEmpty>No results found.</CommandEmpty>
            ) : (
              <CommandGroup>
                <div
                  style={{
                    height: `${virtualizer.getTotalSize()}px`,
                    width: "100%",
                    position: "relative",
                  }}
                >
                  {virtualizer.getVirtualItems().map((virtualItem) => {
                    const option = filteredOptions[virtualItem.index];
                    return (
                      <div
                        key={option.value}
                        ref={
                          !estimateSize ? virtualizer.measureElement : undefined
                        }
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          transform: `translateY(${virtualItem.start}px)`,
                        }}
                        data-index={virtualItem.index}
                      >
                        <div
                          className="flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground"
                          onClick={() => handleSelect(option.value)}
                          role="option"
                          aria-selected={selected.includes(option.value)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selected.includes(option.value)
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {option.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CommandGroup>
            )}
          </div>
        </CommandList>
      </Command>
    </div>
  );
}
export { MultiSelect };
