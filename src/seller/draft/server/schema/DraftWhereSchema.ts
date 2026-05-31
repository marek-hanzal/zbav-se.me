import { z } from "zod";
import { WhereSchema } from "@/lib/common/schema";

export const DraftWhereSchema = z
	.looseObject({
		...WhereSchema.shape,
		userId: z.string().optional().meta({
			description: "ID of the user; does not have an effect on API endpoints",
		}),
	})
	.strip()
	.meta({
		id: "DraftWhere",
		description: "Supported fields for filtering drafts",
	});

export type DraftWhereSchema = typeof DraftWhereSchema;

export namespace DraftWhereSchema {
	export type Type = z.infer<DraftWhereSchema>;
}
