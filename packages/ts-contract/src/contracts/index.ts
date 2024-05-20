import { ZodError } from "zod";

export * from "./employee";
export * from "./department";

export function handleError(error: any) {
  if (error instanceof ZodError) {
    const formattedErrors = error.errors.map((err) => ({
      ...err,
      path: err.path.map(String),
    }));
    return {
      status: 400 as const,
      body: { message: "Validation failed", errors: formattedErrors },
    };
  }
  return {
    status: 500 as const,
    body: { message: error.message },
  };
}
