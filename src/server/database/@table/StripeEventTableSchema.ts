import { z } from "zod";

export const StripeEventTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "Unique ID of the Stripe event inbox row",
		}),
		eventId: z.string().meta({
			description: "Stripe event ID",
		}),
		type: z.string().meta({
			description: "Stripe event type",
		}),
		payload: z.record(z.string(), z.unknown()).meta({
			description: "Raw Stripe event payload",
			type: "object",
		}),
		createdAt: z.coerce.date().meta({
			description: "Timestamp when the event was received",
			type: "string",
		}),
		processedAt: z.coerce.date().nullable().meta({
			description: "Timestamp when the event was processed",
			type: "string",
		}),
	})
	.meta({
		id: "StripeEventTable",
		description: "Database row for a Stripe webhook event inbox entry.",
	})
	.strip();

export type StripeEventTableSchema = typeof StripeEventTableSchema;

export namespace StripeEventTableSchema {
	export type Type = z.infer<StripeEventTableSchema>;
}
