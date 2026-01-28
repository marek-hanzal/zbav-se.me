import { z } from "@hono/zod-openapi";

export const FlagTableSchema = z.object({
	id: z.string().openapi({
		description: "ID of the flag entry",
	}),
	userId: z.string().openapi({
		description: "ID of the user who flagged the listing",
	}),
	listingId: z.string().openapi({
		description: "ID of the listing",
	}),
	createdAt: z.coerce.date().openapi({
		description: "Creation timestamp",
		type: "string",
	}),
});

export type FlagTableSchema = typeof FlagTableSchema;

export namespace FlagTableSchema {
	export type Type = z.infer<FlagTableSchema>;
}
