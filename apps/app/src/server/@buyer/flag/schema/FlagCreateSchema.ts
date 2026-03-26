import { z } from "@hono/zod-openapi";

export const FlagCreateSchema = z
	.looseObject({
		listingId: z.string().openapi({
			description: "ID of the listing to flag",
		}),
	})
	.strip()
	.openapi({
		description: "Flag create schema",
	});

export type FlagCreateSchema = typeof FlagCreateSchema;

export namespace FlagCreateSchema {
	export type Type = z.infer<FlagCreateSchema>;
}
