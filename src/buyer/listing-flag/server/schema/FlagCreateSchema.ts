import { z } from "zod";

export const FlagCreateSchema = z
	.looseObject({
		listingId: z.string().meta({
			description: "ID of the listing to flag",
		}),
	})
	.strip()
	.meta({
		id: "FlagCreate",
		description: "Flag create schema",
	});

export type FlagCreateSchema = typeof FlagCreateSchema;

export namespace FlagCreateSchema {
	export type Type = z.infer<FlagCreateSchema>;
}
