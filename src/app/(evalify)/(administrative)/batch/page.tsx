"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminPageLayout } from "@/components/admin/common/admin-page-layout";
import { useBatches } from "@/components/admin/batch/hooks/use-batch";
import { getColumns } from "@/components/admin/batch/batch-column";
import { BatchDialog } from "@/components/admin/batch/batch-dialog";
import { DeleteBatchDialog } from "@/components/admin/batch/delete-batch-dialog";
import { Batch } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import batchQueries from "@/repo/batch-queries/batch-queries";
import { useToast } from "@/hooks/use-toast";

function useBatchesForDataTable(
  page: number,
  pageSize: number,
  search: string,
  dateRange: { from_date: string; to_date: string },
  sortBy: string,
  sortOrder: string,
  columnFilters?: Record<string, string[]>,
) {
  return useBatches(
    search,
    page - 1,
    pageSize,
    columnFilters,
    sortBy,
    sortOrder,
  );
}

useBatchesForDataTable.isQueryHook = true;

export default function BatchesPage() {
  const [selectedBatch, setSelectedBatch] = useState<Batch | undefined>();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState<string | null>(null);
  const { data: session } = useSession();
  const accessToken = session?.access_token;
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();

  const { mutate: bulkDelete } = useMutation({
    mutationFn: (batchIds: (string | number)[]) => {
      if (!accessToken) {
        return Promise.reject(new Error("Not authenticated"));
      }
      return batchQueries.deleteBatch(String(batchIds[0]));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batches"] });
      toast("Batch deleted successfully", {
        description: "The batch has been successfully deleted.",
      });
    },
  });

  const handleCreate = () => {
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (batch: Batch) => {
    setSelectedBatch(batch);
    setIsEditDialogOpen(true);
  };

  const handleRowClick = (batch: Batch) => {
    router.push(`/batch/${batch.id}`);
  };

  const handleDelete = (batchId: string) => {
    setBatchToDelete(batchId);
    setIsDeleteDialogOpen(true);
  };

  const columnsWrapper = () => {
    return getColumns(handleEdit, handleDelete);
  };

  const columnFilterOptions = [
    {
      columnId: "isActive",
      title: "Status",
      options: [
        { label: "Active", value: "true" },
        { label: "Inactive", value: "false" },
      ],
    },
  ];

  return (
    <AdminPageLayout
      title="Batches Management"
      description="Manage student batches, graduation years, and department assignments"
      createButtonText="Add Batch"
      onCreateClick={handleCreate}
      config={{
        enableUrlState: true,
        enableDateFilter: true,
        enableColumnFilters: true,
        enableDelete: true,
        enableExport: false,
        enablePagination: true,
        enableSearch: true,
        enableToolbar: true,
        enableColumnVisibility: true,
      }}
      exportConfig={{
        entityName: "batches",
        columnMapping: {
          name: "Batch Name",
          graduationYear: "Graduation Year",
          department: "Department",
          section: "Section",
          isActive: "Status",
        },
        columnWidths: [
          { wch: 30 },
          { wch: 15 },
          { wch: 15 },
          { wch: 10 },
          { wch: 10 },
        ],
        headers: [
          "name",
          "graduationYear",
          "department",
          "section",
          "isActive",
        ],
      }}
      getColumns={columnsWrapper}
      fetchDataFn={useBatchesForDataTable}
      idField="id"
      columnFilterOptions={columnFilterOptions}
      deleteFn={bulkDelete as (batchIds: (string | number)[]) => Promise<void>}
      onRowClick={handleRowClick}
    >
      <BatchDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        mode="create"
      />

      {selectedBatch && (
        <BatchDialog
          batch={selectedBatch}
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedBatch(undefined);
          }}
          mode="edit"
        />
      )}

      {batchToDelete && (
        <DeleteBatchDialog
          batchId={batchToDelete}
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setBatchToDelete(null);
          }}
        />
      )}
    </AdminPageLayout>
  );
}
