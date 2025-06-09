import { useQuery } from "@tanstack/react-query";
import { Department } from "@/types/types";
import * as departmentQueries from "@/repo/department-queries/department-queries";
import axiosInstance from "@/lib/axios/axios-client";

interface DataTableResponse {
  data: Department[];
  pagination: {
    total_pages: number;
    current_page: number;
    per_page: number;
    total_count: number;
  };
}

interface DepartmentResponse {
  id: string;
  name: string;
  batches?: Array<{
    id: string;
    name: string;
    graduationYear: string;
    section: string;
  }>;
}

export const useDepartments = (
  searchQuery?: string,
  page: number = 0,
  size: number = 10,
  columnFilters?: Record<string, string[]>,
  sortBy?: string,
  sortOrder?: "asc" | "desc",
) => {
  const query = useQuery({
    queryKey: [
      "departments",
      searchQuery,
      page,
      size,
      columnFilters,
      sortBy,
      sortOrder,
    ],
    queryFn: async (): Promise<DataTableResponse> => {
      const endpoint = searchQuery
        ? "/api/department/search"
        : "/api/department";
      const params: { [key: string]: string | number | undefined } = {
        page: page,
        size: size,
      };

      if (sortBy) {
        params.sort_by = sortBy;
      }

      if (sortOrder) {
        params.sort_order = sortOrder;
      }

      if (searchQuery) {
        params.query = searchQuery;
      }

      try {
        const response = await axiosInstance.get(endpoint, { params });
        const backendResponse = response.data;

        if (backendResponse.data && backendResponse.pagination) {
          const departments = backendResponse.data.map(
            (dept: DepartmentResponse) => ({
              id: dept.id,
              name: dept.name,
              batches: dept.batches || [],
            }),
          );

          return {
            data: departments,
            pagination: backendResponse.pagination,
          };
        }

        if (Array.isArray(backendResponse)) {
          let filteredData = backendResponse;

          if (searchQuery) {
            filteredData = filteredData.filter((department: Department) =>
              department.name
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()),
            );
          }

          return {
            data: filteredData,
            pagination: {
              total_pages: Math.ceil(filteredData.length / size),
              current_page: page,
              per_page: size,
              total_count: filteredData.length,
            },
          };
        }

        return {
          data: [],
          pagination: {
            total_pages: 0,
            current_page: page,
            per_page: size,
            total_count: 0,
          },
        };
      } catch (error) {
        console.error("Error fetching departments:", error);
        return {
          data: [],
          pagination: {
            total_pages: 0,
            current_page: page,
            per_page: size,
            total_count: 0,
          },
        };
      }
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const queryWithFlag = query as typeof query & { isQueryHook: boolean };
  queryWithFlag.isQueryHook = true;
  return queryWithFlag;
};

export const useAllDepartments = (options: { enabled?: boolean } = {}) => {
  const { enabled = true } = options;

  return useQuery({
    queryKey: ["all-departments"],
    queryFn: async (): Promise<Department[]> => {
      const url = "/api/department/all";

      try {
        const response = await axiosInstance.get(url);
        const responseData = response.data;
        if (Array.isArray(responseData)) {
          return responseData;
        }
        if (responseData.data) {
          return responseData.data.map((dept: DepartmentResponse) => ({
            id: dept.id,
            name: dept.name,
            batches: dept.batches || [],
          }));
        }
        return [];
      } catch (error) {
        console.error("Error fetching all departments:", error);
        return [];
      }
    },
    enabled: enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useDepartmentBatches = (departmentId: string | null) => {
  return useQuery({
    queryKey: ["departmentBatches", departmentId],
    queryFn: () => {
      if (!departmentId) throw new Error("No department selected");
      return departmentQueries.getBatchesByDepartment(departmentId);
    },
    enabled: !!departmentId,
  });
};

export const useDepartmentsQuery = () => {
  return useQuery({
    queryKey: ["departments"],
    queryFn: () => {
      return departmentQueries.getAllDepartments();
    },
  });
};
