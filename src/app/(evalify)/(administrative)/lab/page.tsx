"use client";
import React, { useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { useLabs } from "@/components/admin/lab/hooks/use-lab";
import { getColumns } from "@/components/admin/lab/lab-columns";
import { LabDialog } from "@/components/admin/lab/lab-dialog";
import { DeleteLabDialog } from "@/components/admin/lab/delete-lab-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
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
  return useLabs(
    search,
    page - 1,
    pageSize,
    columnFilters,
    sortBy,
    sortOrder,
    "name", // Default to name search for now
  );
}

useLabsForDataTable.isQueryHook = true;

export default function LabsPage() {
  const [searchType, setSearchType] = useState<"name" | "block" | "ipSubnet">(
    "name",
  );
  const [isLabDialogOpen, setIsLabDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLab, setSelectedLab] = useState<Lab | undefined>(undefined);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const handleRowClick = (lab: Lab) => {
    // You can navigate to lab details page if needed
    // router.push(`/lab/${lab.id}`);
    console.log("Row clicked:", lab);
  };

  const handleCreateLab = () => {
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
  // Create a custom toolbar component that will be rendered in the DataTable toolbar
  const CustomToolbarComponent = () => (
    <div className="flex items-center gap-2">
      {/* Search Type Selector - positioned next to search bar */}
      <Select
        value={searchType}
        onValueChange={(value: "name" | "block" | "ipSubnet") =>
          setSearchType(value)
        }
      >
        <SelectTrigger className="w-[120px] h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name">Name</SelectItem>
          <SelectItem value="block">Block</SelectItem>
          <SelectItem value="ipSubnet">IP Subnet</SelectItem>
        </SelectContent>
      </Select>
      {/* Add Lab Button - styled like export button */}
      <Button
        onClick={handleCreateLab}
        variant="outline"
        size="sm"
        className="h-8"
      >
        Add Lab
      </Button>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Labs Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage computer lab resources and network configurations
          </p>
        </div>
      </div>

      <div>
        <DataTable
          config={{
            enableUrlState: true,
            enableDateFilter: false,
            enableColumnFilters: false,
            enableDelete: false,
          }}
          exportConfig={{
            entityName: "labs",
            columnMapping: {
              name: "Lab Name",
              block: "Block",
              ipSubnet: "IP Subnet",
            },
            columnWidths: [{ wch: 30 }, { wch: 15 }, { wch: 20 }],
            headers: ["Lab Name", "Block", "IP Subnet"],
          }}
          getColumns={columnsWrapper}
          fetchDataFn={useLabsForDataTable}
          idField="id"
          onRowClick={handleRowClick}
          renderToolbarContent={() => <CustomToolbarComponent />}
        />
      </div>

      {/* Dialogs */}
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
    </div>
  );
}
