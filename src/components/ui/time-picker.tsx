"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  value?: string; // 24-hour format (HH:MM)
  onChange: (time: string) => void;
  placeholder?: string;
  className?: string;
}

// Convert 24-hour time to 12-hour format with AM/PM
const formatTo12Hour = (
  time24: string,
): { hour: string; minute: string; period: string } => {
  if (!time24) return { hour: "12", minute: "00", period: "AM" };

  const [hours, minutes] = time24.split(":");
  const hour24 = parseInt(hours, 10);
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;

  return {
    hour: hour12.toString(),
    minute: minutes || "00",
    period,
  };
};

// Convert 12-hour time to 24-hour format
const formatTo24Hour = (
  hour: string,
  minute: string,
  period: string,
): string => {
  const hour12 = parseInt(hour, 10);
  let hour24 = hour12;

  if (period === "AM" && hour12 === 12) {
    hour24 = 0;
  } else if (period === "PM" && hour12 !== 12) {
    hour24 = hour12 + 12;
  }

  return `${hour24.toString().padStart(2, "0")}:${minute}`;
};

export function TimePicker({
  value,
  onChange,
  placeholder = "Select time",
  className,
}: TimePickerProps) {
  const { hour, minute, period } = formatTo12Hour(value || "");
  const [isOpen, setIsOpen] = useState(false);

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0"),
  );

  const handleTimeChange = (
    newHour: string,
    newMinute: string,
    newPeriod: string,
  ) => {
    const time24 = formatTo24Hour(newHour, newMinute, newPeriod);
    onChange(time24);
  };

  const displayTime = value ? `${hour}:${minute} ${period}` : placeholder;
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal min-w-[120px] w-auto",
            !value && "text-muted-foreground",
            className,
          )}
        >
          <Clock className="mr-2 h-4 w-4 shrink-0" />
          <span className="truncate">{displayTime}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="space-y-4">
          <div className="text-sm font-medium text-center">Select Time</div>
          <div className="flex items-center gap-2">
            {/* Hours */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Hour
              </label>
              <Select
                value={hour}
                onValueChange={(newHour) =>
                  handleTimeChange(newHour, minute, period)
                }
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {hours.map((h) => (
                    <SelectItem key={h} value={h}>
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-6">:</div>

            {/* Minutes */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Minute
              </label>
              <Select
                value={minute}
                onValueChange={(newMinute) =>
                  handleTimeChange(hour, newMinute, period)
                }
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {minutes.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* AM/PM */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Period
              </label>
              <Select
                value={period}
                onValueChange={(newPeriod) =>
                  handleTimeChange(hour, minute, newPeriod)
                }
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={() => setIsOpen(false)}>
              Done
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
