import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "~/schema/DefaultFilterSchema";

export const MessageThreadFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
	})
	.openapi("MessageThreadFilter", {
		description: "Filter object for message thread",
	});

export type MessageThreadFilterSchema = typeof MessageThreadFilterSchema;

export namespace MessageThreadFilterSchema {
	export type Type = z.infer<MessageThreadFilterSchema>;
}
