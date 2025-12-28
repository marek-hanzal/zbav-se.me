import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "~/schema/DefaultFilterSchema";

export const MessagePackageFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		messageThreadId: z.string().optional().openapi({
			description: "This filter matches the exact messageThreadId",
		}),
		userId: z.string().optional().openapi({
			description: "This filter matches the exact userId",
		}),
	})
	.openapi("MessagePackageFilter", {
		description: "Filter object for message package",
	});

export type MessagePackageFilterSchema = typeof MessagePackageFilterSchema;

export namespace MessagePackageFilterSchema {
	export type Type = z.infer<MessagePackageFilterSchema>;
}
