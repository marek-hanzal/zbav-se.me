import { z } from "@hono/zod-openapi";
import { InboxSchema } from "./InboxSchema";

export const UnignoreSchema = z
	.looseObject({
		...InboxSchema.shape,
		family: z.literal("reaction"),
		type: z.literal("unignore"),
		payload: z.looseObject({
			listingId: z.string().openapi({
				description: "Related listing identifier",
			}),
		}),
	})
	.strip()
	.openapi("InboxUnignore");

export type UnignoreSchema = typeof UnignoreSchema;

export namespace UnignoreSchema {
	export type Type = z.infer<UnignoreSchema>;
}
