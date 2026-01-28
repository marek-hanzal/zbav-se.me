import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { MessagePackageFilterSchema } from "~/@user/message-package/schema/MessagePackageFilterSchema";
import { MessagePackageSortSchema } from "~/@user/message-package/schema/MessagePackageSortSchema";
import { MessagePackageWhereSchema } from "~/@user/message-package/schema/MessagePackageWhereSchema";

export const MessagePackageQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: MessagePackageFilterSchema.optional(),
		where: MessagePackageWhereSchema.optional(),
		sort: MessagePackageSortSchema.array().optional(),
	})
	.openapi("MessagePackageQuery", {
		description: "Query object for message package",
	});

export type MessagePackageQuerySchema = typeof MessagePackageQuerySchema;

export namespace MessagePackageQuerySchema {
	export type Type = z.infer<MessagePackageQuerySchema>;
}
