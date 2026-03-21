import z from "zod";

export const ServerOriginSchema = z.object({
	VITE_ORIGIN: z.string().url("Origin is required"),
});
