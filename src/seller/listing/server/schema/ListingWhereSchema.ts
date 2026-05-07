import { z } from "zod";
import { FilterSchema } from "@/lib/common/schema";
import { ListingStatusEnumSchema } from "~/common/listing/enum/ListingStatusEnumSchema";

export const ListingWhereSchema = z
	.looseObject({
		...FilterSchema.shape,
		status: ListingStatusEnumSchema.optional(),
		userId: z.string().optional().meta({
			description: "ID of the user; does not have an effect on API endpoints",
		}),
	})
	.strip()
	.meta({
		id: "ListingWhere",
		description: "Supported fields for filtering listings",
	});

export type ListingWhereSchema = typeof ListingWhereSchema;

export namespace ListingWhereSchema {
	export type Type = z.infer<ListingWhereSchema>;
}
