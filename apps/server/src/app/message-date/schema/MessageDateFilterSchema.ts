import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "~/schema/DefaultFilterSchema";

export const MessageDateFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		messageThreadId: z.string().optional().openapi({
			description: "This filter matches the exact messageThreadId",
		}),
		userId: z.string().optional().openapi({
			description: "This filter matches the exact userId",
		}),
	})
	.openapi("MessageDateFilter", {
		description: "Filter object for message date",
	});

export type MessageDateFilterSchema = typeof MessageDateFilterSchema;

export namespace MessageDateFilterSchema {
	export type Type = z.infer<MessageDateFilterSchema>;
}
