import { z } from "zod";

export const FlagTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "ID of the flag entry",
		}),
		userId: z.string().meta({
			description: "ID of the user who flagged the listing",
		}),
		listingId: z.string().meta({
			description: "ID of the listing",
		}),
		createdAt: z.coerce.date().meta({
			description: "Creation timestamp",
			type: "string",
		}),
	})
	.meta({
		id: "FlagTable",
		description: "Database row for a flagged listing.",
	})
	.strip();

export type FlagTableSchema = typeof FlagTableSchema;

export namespace FlagTableSchema {
	export type Type = z.infer<FlagTableSchema>;
}
