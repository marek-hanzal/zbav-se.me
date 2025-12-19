import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "~/schema/DefaultFilterSchema";

export const MessageSystemFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		messageThreadId: z.string().optional().openapi({
			description: "This filter matches the exact messageThreadId",
		}),
	})
	.openapi("MessageSystemFilter", {
		description: "Filter object for system message",
	});

export type MessageSystemFilterSchema = typeof MessageSystemFilterSchema;

export namespace MessageSystemFilterSchema {
	export type Type = z.infer<MessageSystemFilterSchema>;
}
