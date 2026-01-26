import { z } from "@hono/zod-openapi";

export const UserEventSellerActivitySchema = z
	.looseObject({
		bucket: z
			.enum([
				"low",
				"medium",
				"high",
			])
			.openapi({
				description: "Activity type of the seller",
				example: "low",
			}),
	})
	.strip()
	.openapi("UserEventSellerActivity", {
		description: "This metric describes the approx activity of the user",
	});

export type UserEventSellerActivitySchema = typeof UserEventSellerActivitySchema;

export namespace UserEventSellerActivitySchema {
	export type Type = z.infer<UserEventSellerActivitySchema>;
}
