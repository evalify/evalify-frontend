"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/data-table/data-table";
import { getStudentColumns } from "./student-columns";
import { useCourseStudents } from "./hooks/use-course-students";
import { User } from "@/types/types";
import { Button } from "@/components/ui/button";

interface CourseStudentsTableProps {
  courseId: string;
  onAssign: () => void;
  onDelete: (user: User) => void;
}

export function CourseStudentsTable({
  courseId,
  onAssign,
  onDelete,
}: CourseStudentsTableProps) {
  const router = useRouter();

  function useStudentsForDataTable(
    page: number,
    pageSize: number,
    search: string,
  ) {
    return useCourseStudents(
      courseId,
      search,
      page > 0 ? page - 1 : 0,
      pageSize,
    );
  }
  useStudentsForDataTable.isQueryHook = true;
  const columns = React.useMemo(() => getStudentColumns(onDelete), [onDelete]);

  const handleRowClick = (row: User) => {
    router.push(`/user/${row.id}`);
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={onAssign}>Assign Student</Button>
      </div>
      <DataTable
        config={{
          enableUrlState: false,
          enableDateFilter: false,
          enableSearch: true,
          enableExport: true,
        }}
        exportConfig={{
          entityName: "students",
          columnMapping: {
            name: "Name",
            email: "Email",
            role: "Role",
            isActive: "Status",
          },
          columnWidths: [{ wch: 30 }, { wch: 30 }, { wch: 15 }, { wch: 15 }],
          headers: ["Name", "Email", "Role", "Status"],
        }}
        getColumns={() => columns}
        fetchDataFn={useStudentsForDataTable}
        idField="id"
        onRowClick={handleRowClick}
      />
    </>
  );
}
