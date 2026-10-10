import { z } from "zod";
import { ListingStatusEnumSchema } from "~/listing/schema/ListingStatusEnumSchema";
import { WhereSchema } from "~/query/schema/WhereSchema";
import { TransactionFlowEnumSchema } from "~/transaction-contract/schema/TransactionFlowEnumSchema";

export const ListingWhereSchema = z
	.looseObject({
		...WhereSchema.shape,
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
