"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Lab } from "@/types/types";
import { toast } from "sonner";
import labQueries from "@/repo/lab-queries/lab-queries";

const labSchema = z.object({
  name: z.string().min(1, "Lab name is required"),
  block: z.string().min(1, "Block is required"),
  ipSubnet: z
    .string()
    .min(1, "IP Subnet is required")
    .regex(
      /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/,
      "Invalid IP subnet format (e.g., 192.168.1.0/24)",
    ),
});

type LabFormData = z.infer<typeof labSchema>;

interface LabDialogProps {
  isOpen: boolean;
  onClose: () => void;
  lab?: Lab;
  mode: "create" | "edit";
}

export function LabDialog({ isOpen, onClose, lab, mode }: LabDialogProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LabFormData>({
    resolver: zodResolver(labSchema),
    defaultValues: {
      name: "",
      block: "",
      ipSubnet: "",
    },
  });

  // Reset form when dialog opens/closes or lab changes
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && lab) {
        form.reset({
          name: lab.name,
          block: lab.block,
          ipSubnet: lab.ipSubnet,
        });
      } else {
        form.reset({
          name: "",
          block: "",
          ipSubnet: "",
        });
      }
    }
  }, [isOpen, lab, mode, form]);
  const createMutation = useMutation({
    mutationFn: async (data: LabFormData) => {
      return await labQueries.createLab(data);
    },
    onSuccess: () => {
      toast.success("Lab created successfully");
      queryClient.invalidateQueries({ queryKey: ["labs"] });
      onClose();
      form.reset();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create lab");
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: LabFormData) => {
      if (!lab) throw new Error("Lab ID is required for update");
      return await labQueries.updateLab(lab.id, data);
    },
    onSuccess: () => {
      toast.success("Lab updated successfully");
      queryClient.invalidateQueries({ queryKey: ["labs"] });
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update lab");
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = async (data: LabFormData) => {
    setIsSubmitting(true);
    if (mode === "create") {
      createMutation.mutate(data);
    } else {
      updateMutation.mutate(data);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Lab" : "Edit Lab"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new lab to the system."
              : "Make changes to the lab details."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lab Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter lab name"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="block"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Block</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter block (e.g., A, B, C)"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ipSubnet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IP Subnet</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter IP subnet (e.g., 192.168.1.0/24)"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? mode === "create"
                    ? "Creating..."
                    : "Updating..."
                  : mode === "create"
                    ? "Create Lab"
                    : "Update Lab"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
