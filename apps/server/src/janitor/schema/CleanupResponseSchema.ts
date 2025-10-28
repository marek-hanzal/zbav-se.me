import { z } from "@hono/zod-openapi";
import { CleanupSchema } from "./CleanupSchema";

export const CleanupResponseSchema = z
	.array(CleanupSchema)
	.openapi("CleanupResponse", {
		description: "Array of cleanup operation results",
	});

export type CleanupResponseSchema = typeof CleanupResponseSchema;

export namespace CleanupResponseSchema {
	export type Type = z.infer<CleanupResponseSchema>;
}
