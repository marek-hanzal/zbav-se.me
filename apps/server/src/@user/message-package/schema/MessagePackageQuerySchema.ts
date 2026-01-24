import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { MessagePackageFilterSchema } from "./MessagePackageFilterSchema";
import { MessagePackageSortSchema } from "./MessagePackageSortSchema";

export const MessagePackageQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: MessagePackageFilterSchema.optional(),
		where: MessagePackageFilterSchema.openapi("MessagePackageWhere", {
			description: "App-based filters",
		}).optional(),
		sort: MessagePackageSortSchema.array().optional(),
	})
	.openapi("MessagePackageQuery", {
		description: "Query object for message package",
	});

export type MessagePackageQuerySchema = typeof MessagePackageQuerySchema;

export namespace MessagePackageQuerySchema {
	export type Type = z.infer<MessagePackageQuerySchema>;
}
