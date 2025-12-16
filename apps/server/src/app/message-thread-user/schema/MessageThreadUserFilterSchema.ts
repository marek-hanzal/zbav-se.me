import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "~/schema/DefaultFilterSchema";

export const MessageThreadUserFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		messageThreadId: z.string().optional().openapi({
			description: "This filter matches the exact messageThreadId",
		}),
		userId: z.string().optional().openapi({
			description: "This filter matches the exact userId",
		}),
	})
	.openapi("MessageThreadUserFilter", {
		description: "Filter object for message thread user",
	});

export type MessageThreadUserFilterSchema = typeof MessageThreadUserFilterSchema;

export namespace MessageThreadUserFilterSchema {
	export type Type = z.infer<MessageThreadUserFilterSchema>;
}
