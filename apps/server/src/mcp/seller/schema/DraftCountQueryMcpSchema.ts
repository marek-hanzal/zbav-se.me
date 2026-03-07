import { z } from "@hono/zod-openapi";
import { DraftQueryMcpSchema } from "~/mcp/seller/schema/DraftQueryMcpSchema";

export const DraftCountQueryMcpSchema = z
	.object({
		filter: DraftQueryMcpSchema.shape.filter.optional(),
	})
	.describe(
		"Seller draft count query. Uses the same public filter semantics as seller draft read tools.",
	);

export type DraftCountQueryMcpSchema = typeof DraftCountQueryMcpSchema;

export namespace DraftCountQueryMcpSchema {
	export type Type = z.infer<DraftCountQueryMcpSchema>;
}
