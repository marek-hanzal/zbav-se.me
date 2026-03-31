import { z } from "zod";
import { UserSideEnumSchema } from "~/common/user-event/enum/UserSideEnumSchema";
import { InboxSchema } from "./InboxSchema";

export const TransactionSchema = z
	.looseObject({
		...InboxSchema.shape,
		family: z.literal("transaction"),
		type: z.literal("transaction"),
		payload: z
			.looseObject({
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
					description:
						"Recipient-side transaction detail target used for deep-link routing",
				}),
			})
			.strip(),
	})
	.strip()
	.meta({
		id: "InboxTransaction",
		description: "Inbox transaction event",
	});

export type TransactionSchema = typeof TransactionSchema;

export namespace TransactionSchema {
	export type Type = z.infer<TransactionSchema>;
}
