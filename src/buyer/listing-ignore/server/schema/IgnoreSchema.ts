import { z } from "zod";
import { ListingIgnoreTableSchema } from "~/server/database/@table/ListingIgnoreTableSchema";

export const IgnoreSchema = z
	.looseObject({
		...ListingIgnoreTableSchema.shape,
	})
	.omit({
		userId: true,
		createdAt: true,
	})
	.strip()
	.meta({
		id: "Ignore",
		description: "Ignore data",
	});

export type IgnoreSchema = typeof IgnoreSchema;

export namespace IgnoreSchema {
	export type Type = z.infer<IgnoreSchema>;
}
