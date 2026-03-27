import { z } from "@hono/zod-openapi";
import { InboxSchema } from "./InboxSchema";

export const IgnoreSchema = z
	.looseObject({
		...InboxSchema.shape,
		family: z.literal("reaction"),
		type: z.literal("ignore"),
		payload: z
			.looseObject({
				listingId: z.string().openapi({
					description: "Related listing identifier",
				}),
			})
			.strip(),
	})
	.strip();

export type IgnoreSchema = typeof IgnoreSchema;

export namespace IgnoreSchema {
	export type Type = z.infer<IgnoreSchema>;
}
