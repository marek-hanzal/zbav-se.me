import { z } from "zod";

export const tryZodError = <TSchema extends z.ZodType>(schema: TSchema, data: unknown) => {
	try {
		return schema.parse(data);
	} catch (error) {
		if (error instanceof z.ZodError) {
			console.error("Zod validation failed", z.prettifyError(error));
			console.error("schema", error);
			console.error("data", data);
		}
		throw error;
	}
};
