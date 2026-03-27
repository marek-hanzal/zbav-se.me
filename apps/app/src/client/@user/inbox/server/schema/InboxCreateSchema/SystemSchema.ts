import { z } from "zod";
import { UserSideEnumSchema } from "~/common/user-event/enum/UserSideEnumSchema";
import { InboxSchema } from "./InboxSchema";

export const SystemSchema = z
	.looseObject({
		...InboxSchema.shape,
		family: z.literal("transaction"),
		type: z.literal("system"),
		payload: z.looseObject({
			transactionId: z.string().meta({
				description: "Related transaction identifier",
			}),
			listingId: z.string().meta({
				description: "Related listing identifier for seller-scoped transaction routes",
			}),
			transactionEntryId: z.string().optional().meta({
				description: "Related transaction entry identifier when available",
			}),
			target: UserSideEnumSchema.meta({
				description: "Recipient-side transaction detail target used for deep-link routing",
			}),
		}),
	})
	.strip()
	.meta({
		id: "InboxSystemCreate",
	});

export type SystemSchema = typeof SystemSchema;

export namespace SystemSchema {
	export type Type = z.infer<SystemSchema>;
}
