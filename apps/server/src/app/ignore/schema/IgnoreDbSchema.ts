import { z } from "@hono/zod-openapi";

export const IgnoreDbSchema = z.object({
	id: z.string().openapi({
		description: "ID of the ignore entry",
	}),
	userId: z.string().openapi({
		description: "ID of the user who ignored the listing",
	}),
	listingId: z.string().openapi({
		description: "ID of the listing that was ignored",
	}),
	createdAt: z.coerce.date().openapi({
		description: "Creation timestamp",
		type: "string",
	}),
});

export type IgnoreDbSchema = typeof IgnoreDbSchema;

export namespace IgnoreDbSchema {
	export type Type = z.infer<IgnoreDbSchema>;
}
