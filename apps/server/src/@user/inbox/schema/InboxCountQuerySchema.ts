import { z } from "@hono/zod-openapi";
import { InboxQuerySchema } from "~/@user/inbox/schema/InboxQuerySchema";

export const InboxCountQuerySchema = z
	.looseObject({
		...InboxQuerySchema.pick({
			filter: true,
			where: true,
		}).shape,
	})
	.strip()
	.openapi("InboxCountQuery", {
		description: "Query object for inbox count",
	});

export type InboxCountQuerySchema = typeof InboxCountQuerySchema;

export namespace InboxCountQuerySchema {
	export type Type = z.infer<InboxCountQuerySchema>;
}
