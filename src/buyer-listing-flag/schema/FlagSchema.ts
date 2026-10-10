import { z } from "zod";
import { ListingFlagTableSchema } from "~/database/schema/ListingFlagTableSchema";

export const FlagSchema = z
	.looseObject({
		...ListingFlagTableSchema.shape,
	})
	.omit({
		userId: true,
		createdAt: true,
	})
	.strip()
	.meta({
		id: "Flag",
		description: "Flag data",
	});

export type FlagSchema = typeof FlagSchema;

export namespace FlagSchema {
	export type Type = z.infer<FlagSchema>;
}
