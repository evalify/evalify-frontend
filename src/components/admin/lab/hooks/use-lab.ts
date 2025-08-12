import { useQuery } from "@tanstack/react-query";
import { Lab } from "@/types/types";
import { useSession } from "next-auth/react";
import axiosInstance from "@/lib/axios/axios-client";

interface LabDataTableResponse {
  data: Lab[];
  pagination: {
    total_pages: number;
    current_page: number;
    per_page: number;
    total_count: number;
  };
}

export const useLabs = (
  searchQuery?: string,
  page: number = 0,
  size: number = 10,
  columnFilters?: Record<string, string[]>,
  sortBy?: string,
  sortOrder?: string,
) => {
  const { data: session } = useSession();
  const user = session?.user;

  const query = useQuery({
    queryKey: ["labs", user?.id, searchQuery, page, size, sortBy, sortOrder],
    queryFn: async (): Promise<LabDataTableResponse> => {
      if (!user) throw new Error("User not authenticated");

      const params: { [key: string]: string | number } = {
        page,
        size,
        sort_by: sortBy || "name",
        sort_order: sortOrder || "asc",
      };

      if (searchQuery) {
        // For search endpoint, add the query parameter
        params.query = searchQuery;
      }

      const endpoint = searchQuery ? "/api/lab/search" : "/api/lab";
      const response = await axiosInstance.get(endpoint, { params });
      const backendResponse = response.data;

      // The backend returns a paginated response with data and pagination
      return {
        data: backendResponse.data || [],
        pagination: backendResponse.pagination || {
          total_pages: 1,
          current_page: 1,
          per_page: 10,
          total_count: 0,
        },
      };
    },
    enabled: !!user,
  });

  return { ...query, isQueryHook: true };
};
