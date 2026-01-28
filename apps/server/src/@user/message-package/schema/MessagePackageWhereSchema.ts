import { z } from "@hono/zod-openapi";
import { MessagePackageFilterSchema } from "~/@user/message-package/schema/MessagePackageFilterSchema";

export const MessagePackageWhereSchema = z
	.object({
		...MessagePackageFilterSchema.shape,
	})
	.openapi("MessagePackageWhere", {
		description: "App-based filters",
	});

export type MessagePackageWhereSchema = typeof MessagePackageWhereSchema;

export namespace MessagePackageWhereSchema {
	export type Type = z.infer<MessagePackageWhereSchema>;
}
