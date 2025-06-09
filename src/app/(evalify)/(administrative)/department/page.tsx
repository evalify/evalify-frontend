"use client";
import React, { useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { useDepartments } from "@/components/admin/department/hooks/use-department";
import { getColumns } from "@/components/admin/department/department-column";
import { DepartmentDialog } from "@/components/admin/department/department-dialog";
import { DeleteDepartmentDialog } from "@/components/admin/department/delete-department-dialog";
import { Department } from "@/types/types";

function useDepartmentsForDataTable(
  page: number,
  pageSize: number,
  search: string,
  dateRange: { from_date: string; to_date: string },
  sortBy: string,
  sortOrder: string,
  columnFilters?: Record<string, string[]>,
) {
  return useDepartments(
    search,
    page - 1,
    pageSize,
    columnFilters,
    sortBy,
    sortOrder as "asc" | "desc",
  );
}

useDepartmentsForDataTable.isQueryHook = true;

export default function DepartmentsPage() {
  const [selectedDepartment, setSelectedDepartment] = useState<
    Department | undefined
  >();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<string | null>(
    null,
  );

  const handleEdit = (department: Department) => {
    setSelectedDepartment(department);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (departmentId: string) => {
    setDepartmentToDelete(departmentId);
    setIsDeleteDialogOpen(true);
  };

  const columnsWrapper = () => {
    return getColumns(handleEdit, handleDelete);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Departments Management</h1>
        <DepartmentDialog mode="create" />
      </div>

      <div>
        <DataTable
          config={{
            enableUrlState: true,
            enableDateFilter: false,
            enableColumnFilters: false,
          }}
          exportConfig={{
            entityName: "departments",
            columnMapping: {
              name: "Department Name",
              batches: "Number of Batches",
            },
            columnWidths: [{ wch: 30 }, { wch: 15 }],
            headers: ["Department Name", "Number of Batches"],
          }}
          getColumns={columnsWrapper}
          fetchDataFn={useDepartmentsForDataTable}
          idField="id"
        />
      </div>

      {selectedDepartment && (
        <DepartmentDialog
          department={selectedDepartment}
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedDepartment(undefined);
          }}
          mode="edit"
        />
      )}

      {departmentToDelete && (
        <DeleteDepartmentDialog
          departmentId={departmentToDelete}
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setDepartmentToDelete(null);
          }}
        />
      )}
    </div>
  );
}
