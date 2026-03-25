import { z } from "@hono/zod-openapi";

export const UserEventBuyerDecisionSchema = z
	.looseObject({
		total: z.number().openapi({
			description: "Total number of samples (transactions)",
			example: 0,
		}),
		decisions: z.number().openapi({
			description: "Total number of decisions (success, closed)",
			example: 0,
		}),
		terminal: z.number().openapi({
			description: "Total number of terminal decisions (usually from the other side)",
			example: 0,
		}),
		percent: z.number().openapi({
			description: "Percentage of closed transactions (closed / total)",
			example: 0,
		}),
	})
	.strip()
	.openapi("UserEventBuyerDecision", {
		description: "This metric describes if the user is used to close/success transactions",
	});

export type UserEventBuyerDecisionSchema = typeof UserEventBuyerDecisionSchema;

export namespace UserEventBuyerDecisionSchema {
	export type Type = z.infer<UserEventBuyerDecisionSchema>;
}
