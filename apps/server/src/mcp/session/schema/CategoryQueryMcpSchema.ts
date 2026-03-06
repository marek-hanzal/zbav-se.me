import { z } from "@hono/zod-openapi";

const CursorMcpSchema = z
	.object({
		page: z.number().gte(0).describe("Zero-based page number for category pagination."),
		size: z.number().gte(1).lte(1000).describe("Page size for category pagination."),
	})
	.describe("Pagination cursor for category search.");

const CategoryFilterMcpSchema = z
	.object({
		id: z.string().optional().describe("Exact category id match."),
		idIn: z.array(z.string()).optional().describe("Any-of category id match."),
		fulltext: z
			.string()
			.optional()
			.describe(
				"Broad category search across group, category label, and spotlight text. Use when the seller describes the category in free text.",
			),
		group: z
			.string()
			.optional()
			.describe("Filter by category group label, for example electronics or fashion."),
		category: z
			.string()
			.optional()
			.describe("Filter by concrete category label within a group."),
		locale: z.string().optional().describe("Exact locale match for category labels."),
		localeIn: z.array(z.string()).optional().describe("Allowed locales for category labels."),
		slug: z.string().optional().describe("Exact category slug match."),
	})
	.describe("Public category filters. Prefer filter over internal app where semantics.");

const CategorySortItemMcpSchema = z.object({
	field: z
		.enum([
			"group",
			"category",
			"sort",
		])
		.describe(
			"Category sort field. Use sort to keep category selection stable and predictable.",
		),
	order: z
		.enum([
			"asc",
			"desc",
		])
		.describe("Sort direction."),
});

export const CategoryQueryMcpSchema = z
	.object({
		cursor: CursorMcpSchema.optional(),
		filter: CategoryFilterMcpSchema.optional(),
		sort: z.array(CategorySortItemMcpSchema).optional(),
	})
	.describe(
		"Session category collection query for searching and selecting listing categories during seller draft or publish workflows.",
	);

export type CategoryQueryMcpSchema = typeof CategoryQueryMcpSchema;

export namespace CategoryQueryMcpSchema {
	export type Type = z.infer<CategoryQueryMcpSchema>;
}
