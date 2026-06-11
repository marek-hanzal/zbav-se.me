import z from "zod";

export const ServerStripeSchema = z
	.looseObject({
		SERVER_STRIPE_SECRET: z.string().min(1, "Stripe secret is required"),
		SERVER_STRIPE_WEBHOOK_SECRET: z.string().min(1, "Stripe webhook secret is required"),
	})
	.strip();

export type ServerStripeSchema = typeof ServerStripeSchema;

export namespace ServerStripeSchema {
	export type Type = z.infer<ServerStripeSchema>;
}
