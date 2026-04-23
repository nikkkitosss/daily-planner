import { ApiError } from "./apiError";

export const getIdParam = (idParam: string | string[] | undefined): string => {
  if (!idParam || Array.isArray(idParam)) {
    throw new ApiError(400, "Invalid id parameter");
  }

  return idParam;
};
