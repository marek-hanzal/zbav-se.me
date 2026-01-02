import { z } from "@hono/zod-openapi";

export const UserEventBuyerScoreSchema = z
	.looseObject({
		score: z.number().openapi({
			description: "Low-level score value, usually not presented in UI",
			example: 0,
		}),
		rank: z.number().openapi({
			description: "Rank computed from the score (A-F, 1-6)",
			example: 2,
		}),
	})
	.strip()
	.openapi("UserEventBuyerScore", {
		description: "This metric describes the score of the user",
	});

export type UserEventBuyerScoreSchema = typeof UserEventBuyerScoreSchema;

export namespace UserEventBuyerScoreSchema {
	export type Type = z.infer<UserEventBuyerScoreSchema>;
}
