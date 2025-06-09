import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { courseQueries } from "@/repo/course-queries/course-queries";

export const useFaculty = () => {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["faculty"],
    queryFn: () => {
      return courseQueries.getFaculty();
    },
    enabled: !!session,
  });
};
