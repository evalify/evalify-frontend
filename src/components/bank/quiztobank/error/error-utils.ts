import { ApiErrorResponse } from "@/components/bank/types/bank-types";

export function extractErrorMessage(error: Error): string {
  // Handle axios cancellation
  if (error.name === "CanceledError") {
    return "Request was cancelled";
  }

  const apiError = error as unknown as ApiErrorResponse;

  // Try to extract message from API error response
  if (apiError.response?.data?.message) {
    return apiError.response.data.message;
  }

  // Fallback to error message
  if (error.message) {
    return error.message;
  }

  // Default fallback
  return "An unexpected error occurred";
}

export function isRequestCancelled(error: Error): boolean {
  return error.name === "CanceledError";
}
