import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "~/schema/DefaultFilterSchema";

export const MessagePersonalFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		messageThreadId: z.string().optional().openapi({
			description: "This filter matches the exact messageThreadId",
		}),
		userId: z.string().optional().openapi({
			description: "ID of the user; does not have an effect on API endpoints",
		}),
	})
	.openapi("MessagePersonalFilter", {
		description: "User-land filters",
	});

export type MessagePersonalFilterSchema = typeof MessagePersonalFilterSchema;

export namespace MessagePersonalFilterSchema {
	export type Type = z.infer<MessagePersonalFilterSchema>;
}
