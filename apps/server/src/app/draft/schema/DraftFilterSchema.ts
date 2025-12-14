import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "~/schema/DefaultFilterSchema";

export const DraftFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		userId: z.string().optional().openapi({
			description: "This filter matches drafts with the exact userId",
		}),
	})
	.openapi("DraftFilter", {
		description: "User-land filters",
	});

export type DraftFilterSchema = typeof DraftFilterSchema;

export namespace DraftFilterSchema {
	export type Type = z.infer<DraftFilterSchema>;
}
