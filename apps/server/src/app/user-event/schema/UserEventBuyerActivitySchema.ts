import { z } from "@hono/zod-openapi";

export const UserEventBuyerActivitySchema = z
	.looseObject({
		bucket: z
			.enum([
				"low",
				"medium",
				"high",
			])
			.openapi({
				description: "Activity type of the buyer",
				example: "low",
			}),
	})
	.strip()
	.openapi("UserEventBuyerActivity", {
		description: "This metric describes the approx activity of the user",
	});

export type UserEventBuyerActivitySchema = typeof UserEventBuyerActivitySchema;

export namespace UserEventBuyerActivitySchema {
	export type Type = z.infer<UserEventBuyerActivitySchema>;
}
