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

      // The backend returns an array directly, not a paginated response
      const labs = Array.isArray(backendResponse) ? backendResponse : [];

      return {
        data: labs,
        pagination: {
          total_pages: 1,
          current_page: 0,
          per_page: labs.length,
          total_count: labs.length,
        },
      };
    },
    enabled: !!user,
  });

  return { ...query, isQueryHook: true };
};
