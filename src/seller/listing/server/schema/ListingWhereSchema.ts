import { z } from "zod";
import { FilterSchema } from "@/lib/common/schema";
import { ListingStatusEnumSchema } from "~/common/listing/enum/ListingStatusEnumSchema";
import { TransactionFlowEnumSchema } from "~/common/user-transaction/enum/TransactionFlowEnumSchema";

export const ListingWhereSchema = z
	.looseObject({
		...FilterSchema.shape,
		status: ListingStatusEnumSchema.optional(),
		userId: z.string().optional().meta({
			description: "ID of the user; does not have an effect on API endpoints",
		}),
		flow: TransactionFlowEnumSchema.optional(),
		withTransaction: z.boolean().optional().meta({
			description: "Filter out listings having any transaction.",
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
