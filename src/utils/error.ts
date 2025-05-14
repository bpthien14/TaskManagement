import { CustomError } from "../types/customError.type";

export const createError = ({ message, status }: { message: string; status: number }) => {
    const error = new Error() as CustomError;
    error.message = message;
    error.statusCode = status;
    return error;
};
