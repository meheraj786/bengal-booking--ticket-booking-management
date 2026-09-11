import axios, { AxiosError } from "axios";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

interface RawApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export class ApiError extends Error {
  statusCode: number;
  fieldErrors?: string[];

  constructor(statusCode: number, message: string, fieldErrors?: string[]) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.fieldErrors = fieldErrors;
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<RawApiErrorResponse>) => {
    const status = error.response?.status ?? 500;
    const rawMessage = error.response?.data?.message;
    const isValidationArray = Array.isArray(rawMessage);
    const message = isValidationArray
      ? rawMessage[0]
      : (rawMessage ?? error.message ?? "Something went wrong");

    return Promise.reject(
      new ApiError(status, message, isValidationArray ? rawMessage : undefined),
    );
  },
);
