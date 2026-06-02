import { z } from "zod";
import { WhereSchema } from "@/lib/common/schema";
import { FeedTypeEnumSchema } from "~/common/feed/enum/FeedTypeEnumSchema";

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
