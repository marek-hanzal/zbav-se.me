import { z } from "@hono/zod-openapi";
import { InboxSchema } from "./InboxSchema";

export const UnflagSchema = z
	.looseObject({
		...InboxSchema.shape,
		family: z.literal("reaction"),
		type: z.literal("unflag"),
		payload: z
			.looseObject({
				listingId: z.string().openapi({
					description: "Related listing identifier",
				}),
			})
			.strip(),
	})
	.strip();

export type UnflagSchema = typeof UnflagSchema;

export namespace UnflagSchema {
	export type Type = z.infer<UnflagSchema>;
}
