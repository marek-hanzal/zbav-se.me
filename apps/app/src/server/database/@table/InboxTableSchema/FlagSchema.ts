import { z } from "@hono/zod-openapi";
import { InboxSchema } from "./InboxSchema";

export const FlagSchema = z
	.looseObject({
		...InboxSchema.shape,
		family: z.literal("reaction"),
		type: z.literal("flag"),
		payload: z
			.looseObject({
				listingId: z.string().openapi({
					description: "Related listing identifier",
				}),
			})
			.strip(),
	})
	.strip();

export type FlagSchema = typeof FlagSchema;

export namespace FlagSchema {
	export type Type = z.infer<FlagSchema>;
}
