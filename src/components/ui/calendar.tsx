"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface CalendarProps {
  className?: string;
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  showOutsideDays?: boolean;
}

function Calendar({
  className,
  selected,
  onSelect,
  disabled,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(selected || new Date());

  const today = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Get first day of the month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Get previous month's last days if needed
  const previousMonth = new Date(currentYear, currentMonth - 1, 0);
  const daysInPreviousMonth = previousMonth.getDate();

  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(currentMonth - 1);
    } else {
      newDate.setMonth(currentMonth + 1);
    }
    setCurrentDate(newDate);
  };

  const handleDateClick = (
    day: number,
    isCurrentMonth = true,
    isPreviousMonth = false,
  ) => {
    let selectedDate: Date;

    if (isPreviousMonth) {
      selectedDate = new Date(currentYear, currentMonth - 1, day);
    } else if (!isCurrentMonth) {
      selectedDate = new Date(currentYear, currentMonth + 1, day);
    } else {
      selectedDate = new Date(currentYear, currentMonth, day);
    }

    if (disabled && disabled(selectedDate)) return;

    onSelect?.(selectedDate);
  };

  const isSelected = (
    day: number,
    isCurrentMonth = true,
    isPreviousMonth = false,
  ) => {
    if (!selected) return false;

    let dateToCheck: Date;
    if (isPreviousMonth) {
      dateToCheck = new Date(currentYear, currentMonth - 1, day);
    } else if (!isCurrentMonth) {
      dateToCheck = new Date(currentYear, currentMonth + 1, day);
    } else {
      dateToCheck = new Date(currentYear, currentMonth, day);
    }

    return (
      selected.getDate() === dateToCheck.getDate() &&
      selected.getMonth() === dateToCheck.getMonth() &&
      selected.getFullYear() === dateToCheck.getFullYear()
    );
  };

  const isToday = (day: number, isCurrentMonth = true) => {
    if (!isCurrentMonth) return false;

    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  };

  const isDisabled = (
    day: number,
    isCurrentMonth = true,
    isPreviousMonth = false,
  ) => {
    if (!disabled) return false;

    let dateToCheck: Date;
    if (isPreviousMonth) {
      dateToCheck = new Date(currentYear, currentMonth - 1, day);
    } else if (!isCurrentMonth) {
      dateToCheck = new Date(currentYear, currentMonth + 1, day);
    } else {
      dateToCheck = new Date(currentYear, currentMonth, day);
    }

    return disabled(dateToCheck);
  };

  // Generate calendar days
  const calendarDays = [];

  // Previous month's trailing days
  if (showOutsideDays) {
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      const day = daysInPreviousMonth - i;
      calendarDays.push(
        <button
          key={`prev-${day}`}
          onClick={() => handleDateClick(day, false, true)}
          disabled={isDisabled(day, false, true)}
          className={cn(
            "h-9 w-9 p-0 font-normal text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            isSelected(day, false, true) &&
              "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
            isDisabled(day, false, true) &&
              "text-muted-foreground opacity-50 cursor-not-allowed",
          )}
        >
          {day}
        </button>,
      );
    }
  } else {
    for (let i = 0; i < firstDayWeekday; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="h-9 w-9" />);
    }
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(
      <button
        key={`current-${day}`}
        onClick={() => handleDateClick(day)}
        disabled={isDisabled(day)}
        className={cn(
          "h-9 w-9 p-0 font-normal hover:bg-accent hover:text-accent-foreground",
          isSelected(day) &&
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
          isToday(day) &&
            !isSelected(day) &&
            "bg-accent text-accent-foreground",
          isDisabled(day) &&
            "text-muted-foreground opacity-50 cursor-not-allowed",
        )}
      >
        {day}
      </button>,
    );
  }

  // Next month's leading days
  const remainingDays = 42 - calendarDays.length; // 6 rows × 7 days
  if (showOutsideDays && remainingDays > 0) {
    for (let day = 1; day <= remainingDays; day++) {
      calendarDays.push(
        <button
          key={`next-${day}`}
          onClick={() => handleDateClick(day, false, false)}
          disabled={isDisabled(day, false, false)}
          className={cn(
            "h-9 w-9 p-0 font-normal text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            isSelected(day, false, false) &&
              "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
            isDisabled(day, false, false) &&
              "text-muted-foreground opacity-50 cursor-not-allowed",
          )}
        >
          {day}
        </button>,
      );
    }
  }

  return (
    <div className={cn("p-3", className)} {...props}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => navigateMonth("prev")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="font-semibold">
          {months[currentMonth]} {currentYear}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => navigateMonth("next")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((day) => (
          <div
            key={day}
            className="h-9 w-9 flex items-center justify-center text-sm font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">{calendarDays}</div>
    </div>
  );
}

export { Calendar };
