"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DataTable } from "@/components/data-table/data-table";
import {
  useBatchById,
  useBatchStudents,
} from "@/components/admin/batch/hooks/use-batch";
import { getStudentColumns } from "@/components/admin/batch/batch-student-column";
import { User } from "@/types/types";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { AssignStudentToBatchDialog } from "@/components/admin/batch/assign-student-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import batchQueries from "@/repo/batch-queries/batch-queries";
import { toast } from "sonner";

export default function BatchDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const batchId = params.batchId as string;
  const queryClient = useQueryClient();

  const [isAssignStudentDialogOpen, setIsAssignStudentDialogOpen] =
    useState(false);
  const [studentToDelete, setStudentToDelete] = useState<User | null>(null);

  const { data: batch, isError: isBatchError } = useBatchById(batchId);

  const deleteStudentMutation = useMutation({
    mutationFn: (studentId: string) => {
      return batchQueries.removeStudentFromBatch(batchId, studentId);
    },
    onSuccess: () => {
      toast.success("Student removed successfully");
      queryClient.invalidateQueries({ queryKey: ["batchStudents", batchId] });
      setStudentToDelete(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove student");
    },
  });

  function useBatchStudentsForDataTable(
    page: number,
    pageSize: number,
    search: string,
    _dateRange: { from_date: string; to_date: string },
    sortBy: string,
    sortOrder: string,
  ) {
    return useBatchStudents(
      batchId,
      search,
      page - 1,
      pageSize,
      sortBy,
      sortOrder,
    );
  }
  useBatchStudentsForDataTable.isQueryHook = true;

  const columnsWrapper = (): ColumnDef<User>[] => {
    return getStudentColumns(handleDeleteStudent);
  };

  const handleDeleteStudent = (student: User) => {
    setStudentToDelete(student);
  };

  const handleRowClick = (row: User) => {
    router.push(`/user/${row.id}`);
  };

  if (isBatchError) {
    return (
      <div className="p-4 text-red-500">
        Error loading batch details or batch not found.
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          Students in {batch ? batch.name : "..."}
        </h1>
        <Button onClick={() => setIsAssignStudentDialogOpen(true)}>
          Assign Student
        </Button>
      </div>

      <div>
        <DataTable
          key={batchId}
          config={{
            enableUrlState: true,
            enableColumnFilters: false,
            enableDateFilter: false,
            enableDelete: false,
          }}
          exportConfig={{
            entityName: "students",
            columnMapping: {
              name: "Name",
              email: "Email",
              phoneNumber: "Phone Number",
            },
            columnWidths: [{ wch: 30 }, { wch: 30 }, { wch: 20 }],
            headers: ["Name", "Email", "Phone Number"],
          }}
          getColumns={columnsWrapper}
          fetchDataFn={useBatchStudentsForDataTable}
          idField="id"
          onRowClick={handleRowClick}
        />
      </div>
      {batchId && (
        <AssignStudentToBatchDialog
          isOpen={isAssignStudentDialogOpen}
          onClose={() => setIsAssignStudentDialogOpen(false)}
          batchId={batchId}
          onSuccess={() => {
            queryClient.invalidateQueries({
              queryKey: ["batchStudents", batchId],
            });
          }}
        />
      )}
      <DeleteDialog
        isOpen={!!studentToDelete}
        onClose={() => setStudentToDelete(null)}
        onConfirm={() =>
          studentToDelete && deleteStudentMutation.mutate(studentToDelete.id)
        }
        title="Remove Student"
        description={`Are you sure you want to remove ${
          studentToDelete?.name || "this student"
        } from the batch?`}
        isLoading={deleteStudentMutation.isPending}
      />
    </div>
  );
}
