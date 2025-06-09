"use client";
import { Button } from "@/components/ui/button";
import type React from "react";

import { Minus, Plus } from "lucide-react";

interface CounterProps {
  value: number;
  onChange: (value: number) => void;
}

export default function Counter({ value, onChange }: CounterProps) {
  function decreaseCount(e: React.MouseEvent) {
    e.preventDefault(); // Prevent form submission
    if (value > 1) {
      onChange(value - 1);
    }
  }

  function increaseCount(e: React.MouseEvent) {
    e.preventDefault(); // Prevent form submission
    onChange(value + 1);
  }

  return (
    <div className="flex gap-2">
      <Button type="button" onClick={decreaseCount}>
        <Minus />
      </Button>
      <span className="p-1.5">{value}</span>
      <Button type="button" onClick={increaseCount}>
        <Plus />
      </Button>
    </div>
  );
}
