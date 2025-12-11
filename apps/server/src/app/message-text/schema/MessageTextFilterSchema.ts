import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "~/schema/DefaultFilterSchema";

export const MessageTextFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		messageThreadId: z.string().optional().openapi({
			description: "This filter matches the exact messageThreadId",
		}),
	})
	.openapi("MessageTextFilter", {
		description: "Filter object for listing transaction message",
	});

export type MessageTextFilterSchema = typeof MessageTextFilterSchema;

export namespace MessageTextFilterSchema {
	export type Type = z.infer<MessageTextFilterSchema>;
}
