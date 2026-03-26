import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "~/common/schema/DefaultFilterSchema";

export const DraftFilterSchema = z
	.looseObject({
		...DefaultFilterSchema.shape,
		userId: z.string().optional().openapi({
			description: "This filter matches drafts with the exact userId",
		}),
		updatedAtGte: z.coerce.date().optional().openapi({
			description:
				"This filter matches drafts with updatedAt greater than or equal to the provided date",
			type: "string",
		}),
		updatedAtLte: z.coerce.date().optional().openapi({
			description:
				"This filter matches drafts with updatedAt less than or equal to the provided date",
			type: "string",
		}),
		usedAtIsNull: z.boolean().optional().openapi({
			description:
				"This filter matches drafts where usedAt is null (true) or not null (false)",
		}),
	})
	.strip()
	.openapi("DraftFilter", {
		description: "User-land filters",
	});

export type DraftFilterSchema = typeof DraftFilterSchema;

export namespace DraftFilterSchema {
	export type Type = z.infer<DraftFilterSchema>;
}
