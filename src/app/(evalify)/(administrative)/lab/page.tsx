"use client";
import React, { useState } from "react";
import { AdminPageLayout } from "@/components/admin/common/admin-page-layout";
import { useLabs } from "@/components/admin/lab/hooks/use-lab";
import { getColumns } from "@/components/admin/lab/lab-columns";
import { LabDialog } from "@/components/admin/lab/lab-dialog";
import { DeleteLabDialog } from "@/components/admin/lab/delete-lab-dialog";
import { Lab } from "@/types/types";

function useLabsForDataTable(
  page: number,
  pageSize: number,
  search: string,
  dateRange: { from_date: string; to_date: string },
  sortBy: string,
  sortOrder: string,
  columnFilters?: Record<string, string[]>,
) {
  return useLabs(search, page - 1, pageSize, columnFilters, sortBy, sortOrder);
}

useLabsForDataTable.isQueryHook = true;

export default function LabsPage() {
  const [isLabDialogOpen, setIsLabDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLab, setSelectedLab] = useState<Lab | undefined>(undefined);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");

  const handleRowClick = (lab: Lab) => {
    // You can navigate to lab details page if needed
    // router.push(`/lab/${lab.id}`);
    console.log("Row clicked:", lab);
  };

  const handleCreate = () => {
    setSelectedLab(undefined);
    setDialogMode("create");
    setIsLabDialogOpen(true);
  };

  const handleEditLab = (lab: Lab) => {
    setSelectedLab(lab);
    setDialogMode("edit");
    setIsLabDialogOpen(true);
  };

  const handleDeleteLab = (lab: Lab) => {
    setSelectedLab(lab);
    setIsDeleteDialogOpen(true);
  };

  const columnsWrapper = () => {
    return getColumns({
      onEdit: handleEditLab,
      onDelete: handleDeleteLab,
    });
  };

  return (
    <AdminPageLayout
      title="Labs Management"
      description="Manage computer lab resources and network configurations"
      createButtonText="Add Lab"
      onCreateClick={handleCreate}
      config={{
        enableUrlState: true,
        enableDateFilter: false,
        enableColumnFilters: false,
        enableDelete: false,
        enableExport: false,
        enablePagination: true,
        enableSearch: true,
        enableToolbar: true,
        enableColumnVisibility: true,
      }}
      exportConfig={{
        entityName: "labs",
        columnMapping: {
          name: "Lab Name",
          block: "Block",
          ipSubnet: "IP Subnet",
        },
        columnWidths: [{ wch: 30 }, { wch: 15 }, { wch: 20 }],
        headers: ["name", "block", "ipSubnet"],
      }}
      getColumns={columnsWrapper}
      fetchDataFn={useLabsForDataTable}
      idField="id"
      onRowClick={handleRowClick}
    >
      <LabDialog
        isOpen={isLabDialogOpen}
        onClose={() => setIsLabDialogOpen(false)}
        lab={selectedLab}
        mode={dialogMode}
      />

      <DeleteLabDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        labId={selectedLab?.id || null}
        labName={selectedLab?.name}
      />
    </AdminPageLayout>
  );
}
