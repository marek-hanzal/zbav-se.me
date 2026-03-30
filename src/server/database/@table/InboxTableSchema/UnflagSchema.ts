import { z } from "zod";
import { InboxSchema } from "./InboxSchema";

export const UnflagSchema = z
	.looseObject({
		...InboxSchema.shape,
		family: z.literal("reaction"),
		type: z.literal("unflag"),
		payload: z
			.looseObject({
				listingId: z.string().meta({
					description: "Related listing identifier",
				}),
			})
			.strip(),
	})
	.strip()
	.meta({
		id: "InboxUnflag",
		description: "Inbox reaction event for unflag",
	});

export type UnflagSchema = typeof UnflagSchema;

export namespace UnflagSchema {
	export type Type = z.infer<UnflagSchema>;
}
