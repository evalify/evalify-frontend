"use client";
import React, { useState } from "react";
import { AdminPageLayout } from "@/components/admin/common/admin-page-layout";
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
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<string | null>(
    null,
  );

  const handleCreate = () => {
    setIsCreateDialogOpen(true);
  };

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
    <AdminPageLayout
      title="Departments Management"
      description="Manage academic departments and their associated batches"
      createButtonText="Add Department"
      onCreateClick={handleCreate}
      config={{
        enableUrlState: true,
        enableDateFilter: false,
        enableColumnFilters: false,
        enableExport: false,
        enablePagination: true,
        enableSearch: true,
        enableToolbar: true,
        enableColumnVisibility: true,
      }}
      exportConfig={{
        entityName: "departments",
        columnMapping: {
          name: "Department Name",
          batches: "Number of Batches",
        },
        columnWidths: [{ wch: 30 }, { wch: 15 }],
        headers: ["name", "batches"],
      }}
      getColumns={columnsWrapper}
      fetchDataFn={useDepartmentsForDataTable}
      idField="id"
    >
      <DepartmentDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        mode="create"
      />

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
    </AdminPageLayout>
  );
}
