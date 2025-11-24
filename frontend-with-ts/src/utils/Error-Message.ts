import { AxiosError } from "axios";

interface ErrorResponse {
  errorStatusCode: number;
  message: string;
}

const errorMessage = (error: unknown): ErrorResponse => {
  const axiosError = error as AxiosError<{ msg?: string }>;
  const message =
    (axiosError.response?.data?.msg) ||
    axiosError.message ||
    String(error);
  alert(message);
  return { 
    errorStatusCode: axiosError.response?.status || 500, 
    message 
  };
};

export default errorMessage;

