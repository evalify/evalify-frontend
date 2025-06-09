"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/data-table/data-table";
import { getBatchColumns } from "./batch-columns";
import { useCourseBatches } from "./hooks/use-course-batches";
import { Batch } from "@/types/types";
import { Button } from "@/components/ui/button";

type UseBatchesForDataTable = (
  page: number,
  pageSize: number,
  search: string,
) => ReturnType<typeof useCourseBatches>;

const createUseBatchesForDataTable = (
  courseId: string,
): UseBatchesForDataTable & { isQueryHook: true } => {
  const useBatchesForDataTable = (
    page: number,
    pageSize: number,
    search: string,
  ) => {
    return useCourseBatches(
      courseId,
      search,
      page > 0 ? page - 1 : 0,
      pageSize,
    );
  };
  (
    useBatchesForDataTable as UseBatchesForDataTable & { isQueryHook?: boolean }
  ).isQueryHook = true;
  return useBatchesForDataTable as UseBatchesForDataTable & {
    isQueryHook: true;
  };
};

interface CourseBatchesTableProps {
  courseId: string;
  onAssign: () => void;
  onDelete: (batch: Batch) => void;
}

export function CourseBatchesTable({
  courseId,
  onAssign,
  onDelete,
}: CourseBatchesTableProps) {
  const router = useRouter();
  const useBatchesForDataTable = React.useMemo(
    () => createUseBatchesForDataTable(courseId),
    [courseId],
  );
  const columns = React.useMemo(() => getBatchColumns(onDelete), [onDelete]);

  const handleRowClick = (row: Batch) => {
    router.push(`/batch/${row.id}`);
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={onAssign}>Assign Batch</Button>
      </div>
      <DataTable
        config={{
          enableUrlState: false,
          enableDateFilter: false,
          enableSearch: true,
          enableExport: true,
        }}
        exportConfig={{
          entityName: "batches",
          columnMapping: {
            name: "Batch Name",
            graduationYear: "Graduation Year",
            section: "Section",
            isActive: "Status",
          },
          columnWidths: [{ wch: 30 }, { wch: 20 }, { wch: 15 }, { wch: 15 }],
          headers: ["Batch Name", "Graduation Year", "Section", "Status"],
        }}
        getColumns={() => columns}
        fetchDataFn={useBatchesForDataTable}
        idField="id"
        onRowClick={handleRowClick}
      />
    </>
  );
}
