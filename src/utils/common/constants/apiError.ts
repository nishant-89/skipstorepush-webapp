import { AxiosError } from "axios";

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    // Check if there's a response and extract the message
    return error.response?.data?.message || "An unexpected error occurred";
  } else if (error instanceof Error) {
    // Fallback for other errors that might be instances of Error
    return error.message || "An unexpected error occurred";
  } else {
    // Generic fallback for unknown error types
    return "An unexpected error occurred";
  }
}
