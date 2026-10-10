import { z } from "zod";
import { FeedTypeEnumSchema } from "~/common/feed/enum/FeedTypeEnumSchema";
import { WhereSchema } from "~/query/schema/WhereSchema";

export const FeedWhereSchema = z
	.looseObject({
		...WhereSchema.shape,
		userId: z.string().optional().meta({
			description: "Exact user id",
		}),
		type: FeedTypeEnumSchema.optional().meta({
			description: "Exact feed type",
		}),
	})
	.strip()
	.meta({
		id: "FeedWhere",
		description: "App-based filters",
	});

export type FeedWhereSchema = typeof FeedWhereSchema;

export namespace FeedWhereSchema {
	export type Type = z.infer<FeedWhereSchema>;
}
