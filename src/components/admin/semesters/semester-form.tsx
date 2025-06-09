"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Semester } from "@/types/types";

interface SemesterFormProps {
  semester?: Semester;
  onSubmit: (data: Omit<Semester, "id">) => void;
}

type SemesterFormValues = {
  name: string;
  year: number;
  isActive: boolean;
};

export function SemesterForm({ semester, onSubmit }: SemesterFormProps) {
  const form = useForm<SemesterFormValues>({
    defaultValues: {
      name: semester?.name || "",
      year: semester?.year || new Date().getFullYear(),
      isActive: semester?.isActive ?? true,
    },
  });

  const handleSubmit = (data: SemesterFormValues) => {
    // Basic validation
    if (!data.name.trim()) {
      form.setError("name", { message: "Semester name is required" });
      return;
    }

    if (!data.year || data.year < 2000) {
      form.setError("year", { message: "Year must be 2000 or later" });
      return;
    }

    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Semester Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter semester name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={2000}
                  placeholder="Enter year"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active Status</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Set whether this semester is currently active
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {semester ? "Update Semester" : "Create Semester"}
        </Button>
      </form>
    </Form>
  );
}
