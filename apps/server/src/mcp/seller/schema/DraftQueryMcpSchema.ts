import { z } from "@hono/zod-openapi";

const CursorMcpSchema = z
	.object({
		page: z.number().gte(0).describe("Zero-based page number for draft pagination."),
		size: z.number().gte(1).lte(1000).describe("Page size for draft pagination."),
	})
	.describe("Pagination cursor for seller draft queries.");

const DraftFilterMcpSchema = z
	.object({
		id: z.string().optional().describe("Exact draft id match."),
		idIn: z.array(z.string()).optional().describe("Any-of draft id match."),
		fulltext: z
			.string()
			.optional()
			.describe("Broad text search over seller drafts when the exact id is not known."),
		updatedAtGte: z
			.string()
			.datetime()
			.optional()
			.describe("Only include drafts updated at or after this ISO 8601 timestamp."),
		updatedAtLte: z
			.string()
			.datetime()
			.optional()
			.describe("Only include drafts updated at or before this ISO 8601 timestamp."),
		usedAtIsNull: z
			.boolean()
			.optional()
			.describe(
				"Use true for drafts that have not been consumed by publish yet, false for already used drafts.",
			),
	})
	.describe("Public seller draft filters. Prefer filter over internal app where semantics.");

const DraftSortItemMcpSchema = z.object({
	field: z
		.enum([
			"createdAt",
			"updatedAt",
		])
		.describe("Draft sort field. Use updatedAt for recently edited drafts."),
	order: z
		.enum([
			"asc",
			"desc",
		])
		.describe("Sort direction."),
});

export const DraftQueryMcpSchema = z
	.object({
		cursor: CursorMcpSchema.optional(),
		filter: DraftFilterMcpSchema.optional(),
		sort: z.array(DraftSortItemMcpSchema).optional(),
	})
	.describe(
		"Seller draft query for listing existing drafts, fetching one draft, or narrowing by edit status.",
	);

export type DraftQueryMcpSchema = typeof DraftQueryMcpSchema;

export namespace DraftQueryMcpSchema {
	export type Type = z.infer<DraftQueryMcpSchema>;
}
