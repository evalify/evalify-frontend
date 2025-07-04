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
  searchType: "name" | "block" | "ipSubnet" = "name",
) => {
  const { data: session } = useSession();
  const user = session?.user;

  const query = useQuery({
    queryKey: [
      "labs",
      user?.id,
      searchQuery,
      searchType,
      page,
      size,
      sortBy,
      sortOrder,
    ],
    queryFn: async (): Promise<LabDataTableResponse> => {
      if (!user) throw new Error("User not authenticated");

      const params: { [key: string]: string | null } = {
        name: null,
        block: null,
        ipSubnet: null,
      };

      if (searchQuery) {
        // Only set one parameter based on searchType, others remain null
        params[searchType] = searchQuery;
      }

      const endpoint = searchQuery ? "/lab/search" : "/lab";
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
