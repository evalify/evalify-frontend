"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { AdminPageLayout } from "@/components/admin/common/admin-page-layout";
import { getColumns } from "@/components/admin/semesters/semester-columns";
import { Semester } from "@/types/types";
import { CreateSemesterDialog } from "@/components/admin/semesters/create-semester-dialog";
import { SemesterAlerts } from "@/components/admin/semesters/semester-alerts";
import { SemesterDialogs } from "@/components/admin/semesters/semester-dialogs";
import { useSemestersForDataTable } from "@/components/admin/semesters/hook/use-semesters-for-data-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import semesterQueries from "@/repo/semester-queries/semester-queries";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

export default function SemesterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedSemester, setSelectedSemester] =
    React.useState<Semester | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [semesterToDelete, setSemesterToDelete] =
    React.useState<Semester | null>(null);

  const queryClient = useQueryClient();

  const createSemester = useMutation({
    mutationFn: (semester: Omit<Semester, "id">) => {
      return semesterQueries.createSemester(semester);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["semesters"] });
      toast("Semester created successfully");
      setIsCreateDialogOpen(false);
    },
    onError: (error: AxiosError) => {
      toast(error.message || "Failed to create semester");
    },
  });

  const updateSemester = useMutation({
    mutationFn: (semester: Semester) => {
      return semesterQueries.updateSemester(semester);
    },
    onSuccess: (data: Semester) => {
      queryClient.invalidateQueries({ queryKey: ["semesters"] });
      queryClient.invalidateQueries({ queryKey: ["semester", data.id] });
      toast("Semester updated successfully");
      setIsEditDialogOpen(false);
      setSelectedSemester(null);
    },
    onError: (error: AxiosError) => {
      toast(error.message || "Failed to update semester");
    },
  });

  const deleteSemester = useMutation({
    mutationFn: (id: string) => {
      return semesterQueries.deleteSemester(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["semesters"] });
      toast("Semester deleted successfully");
      setIsDeleteDialogOpen(false);
      setSemesterToDelete(null);
    },
    onError: (error: AxiosError) => {
      toast(error.message || "Failed to delete semester");
    },
  });

  const handleAction = (semester: Semester, action: string) => {
    switch (action) {
      case "edit":
        setSelectedSemester(semester);
        setIsEditDialogOpen(true);
        break;
      case "delete":
        setSemesterToDelete(semester);
        setIsDeleteDialogOpen(true);
        break;
    }
  };

  const handleRowClick = (semester: Semester) => {
    router.push(`/semester/${semester.id}/courses`);
  };

  const handleCreate = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCreateSemester = async (data: Omit<Semester, "id">) => {
    try {
      await createSemester.mutateAsync(data);
    } catch (error) {
      console.error("Error creating semester:", error);
    }
  };

  const handleUpdateSemester = async (data: Omit<Semester, "id">) => {
    if (!selectedSemester) return;
    try {
      await updateSemester.mutateAsync({
        id: selectedSemester.id,
        name: data.name as string,
        year: data.year as number,
        isActive: data.isActive as boolean,
      });
    } catch (error) {
      console.error("Error updating semester:", error);
    }
  };

  const handleDeleteSemester = async () => {
    if (!semesterToDelete) return;
    try {
      await deleteSemester.mutateAsync(semesterToDelete.id);
    } catch (error) {
      console.error("Error deleting semester:", error);
    }
  };

  return (
    <div className="space-y-6">
      <SemesterAlerts
        isCreating={createSemester.isPending}
        isUpdating={updateSemester.isPending}
        isDeleting={deleteSemester.isPending}
        hasCreateError={!!createSemester.error}
        hasUpdateError={!!updateSemester.error}
        hasDeleteError={!!deleteSemester.error}
      />

      <AdminPageLayout
        title="Semesters Management"
        description="Manage academic semesters and their associated courses"
        createButtonText="Add Semester"
        onCreateClick={handleCreate}
        config={{
          enableUrlState: true,
          enableDateFilter: true,
          enableColumnFilters: true,
          enableColumnVisibility: true,
          enableExport: false,
          enablePagination: true,
          enableSearch: true,
          enableToolbar: true,
          size: "default",
        }}
        getColumns={() => getColumns(handleAction)}
        fetchDataFn={useSemestersForDataTable}
        idField="id"
        onRowClick={handleRowClick}
        exportConfig={{
          entityName: "semesters",
          columnMapping: {
            name: "Semester Name",
            year: "Year",
            isActive: "Status",
          },
          columnWidths: [{ wch: 30 }, { wch: 15 }, { wch: 15 }],
          headers: ["name", "year", "isActive"],
        }}
        columnFilterOptions={[
          {
            columnId: "isActive",
            title: "Status",
            options: [
              { label: "Active", value: "true" },
              { label: "Inactive", value: "false" },
            ],
          },
        ]}
      />

      <CreateSemesterDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateSemester}
      />

      <SemesterDialogs
        selectedSemester={selectedSemester}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        semesterToDelete={semesterToDelete}
        isDeleting={deleteSemester.isPending}
        onUpdateSemester={handleUpdateSemester}
        onDeleteSemester={handleDeleteSemester}
      />
    </div>
  );
}
