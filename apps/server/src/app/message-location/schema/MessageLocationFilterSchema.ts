import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "~/schema/DefaultFilterSchema";

export const MessageLocationFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		messageThreadId: z.string().optional().openapi({
			description: "This filter matches the exact messageThreadId",
		}),
		userId: z.string().optional().openapi({
			description: "This filter matches the exact userId",
		}),
		locationId: z.string().optional().openapi({
			description: "This filter matches the exact locationId",
		}),
	})
	.openapi("MessageLocationFilter", {
		description: "Filter object for message location",
	});

export type MessageLocationFilterSchema = typeof MessageLocationFilterSchema;

export namespace MessageLocationFilterSchema {
	export type Type = z.infer<MessageLocationFilterSchema>;
}
