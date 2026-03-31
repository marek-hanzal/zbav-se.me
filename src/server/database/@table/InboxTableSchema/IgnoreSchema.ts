import { z } from "zod";
import { InboxSchema } from "./InboxSchema";

export const IgnoreSchema = z
	.looseObject({
		...InboxSchema.shape,
		family: z.literal("reaction"),
		type: z.literal("ignore"),
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
		id: "InboxIgnore",
		description: "Inbox reaction event for ignore",
	});

export type IgnoreSchema = typeof IgnoreSchema;

export namespace IgnoreSchema {
	export type Type = z.infer<IgnoreSchema>;
}
