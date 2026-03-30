import { z } from "zod";

export const IgnoreTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "ID of the ignore entry",
		}),
		userId: z.string().meta({
			description: "ID of the user who ignored the listing",
		}),
		listingId: z.string().meta({
			description: "ID of the listing that was ignored",
		}),
		createdAt: z.coerce.date().meta({
			description: "Creation timestamp",
			type: "string",
		}),
	})
	.meta({
		id: "IgnoreTable",
		description: "Database row for an ignored listing.",
	})
	.strip();

export type IgnoreTableSchema = typeof IgnoreTableSchema;

export namespace IgnoreTableSchema {
	export type Type = z.infer<IgnoreTableSchema>;
}
