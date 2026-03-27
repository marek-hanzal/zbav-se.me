import { z } from "@hono/zod-openapi";
import { ListingEventEnumSchema } from "~/common/listing/enum/ListingEventEnumSchema";

export const ListingEventTableSchema = z
	.looseObject({
		id: z.string().openapi({
			description: "ID of the event",
		}),
		listingId: z.string().openapi({
			description: "ID of the listing",
		}),
		event: ListingEventEnumSchema,
		createdAt: z.coerce.date().openapi({
			description: "Creation timestamp",
			type: "string",
		}),
	})
	.strip();

export type ListingEventTableSchema = typeof ListingEventTableSchema;

export namespace ListingEventTableSchema {
	export type Type = z.infer<ListingEventTableSchema>;
}
