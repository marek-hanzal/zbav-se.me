import { z } from "@hono/zod-openapi";
import { UserSideEnumSchema } from "~/common/user-event/enum/UserSideEnumSchema";
import { InboxSchema } from "./InboxSchema";

export const UnknownSchema = z
	.looseObject({
		...InboxSchema.shape,
		family: z.literal("transaction"),
		type: z.literal("unknown"),
		payload: z
			.looseObject({
				transactionId: z.string().openapi({
					description: "Related transaction identifier",
				}),
				listingId: z.string().openapi({
					description: "Related listing identifier for seller-scoped transaction routes",
				}),
				transactionEntryId: z.string().optional().openapi({
					description: "Related transaction entry identifier when available",
				}),
				target: UserSideEnumSchema.openapi({
					description:
						"Recipient-side transaction detail target used for deep-link routing",
				}),
			})
			.strip(),
	})
	.strip();

export type UnknownSchema = typeof UnknownSchema;

export namespace UnknownSchema {
	export type Type = z.infer<UnknownSchema>;
}
