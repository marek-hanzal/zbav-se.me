import z from "zod";

export const ServerOriginSchema = z.object({
	VITE_APP_ORIGIN: z.string().min(1, "App domain ORIGIN is required (used for CORS and auth)"),
});
