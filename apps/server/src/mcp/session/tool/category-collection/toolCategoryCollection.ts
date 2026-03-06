import { z } from "@hono/zod-openapi";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { categoryCollectionFx } from "~/@session/category/fx/categoryCollectionFx";
import { CategoryItemSchema } from "~/@session/category/schema/CategoryItemSchema";
import { CategoryQuerySchema } from "~/@session/category/schema/CategoryQuerySchema";
import { CategoryMcpOutputSchema } from "~/mcp/session/schema/CategoryMcpOutputSchema";
import { CategoryQueryMcpSchema } from "~/mcp/session/schema/CategoryQueryMcpSchema";
import { McpSchema } from "~/mcp/McpSchema";
import type { McpToolDefinition } from "~/mcp/McpToolDefinition";

const CategoryCollectionMcpSchema = z
	.array(CategoryMcpOutputSchema)
	.describe(
		"Array of category suggestions or exact category matches for seller draft and publish flows.",
	);

type CategoryCollectionMcpSchema = typeof CategoryCollectionMcpSchema;

const examples: McpToolDefinition.Example<CategoryQueryMcpSchema.Type>[] = [
	{
		title: "Find categories from free text",
		description:
			"Use free-text category lookup when the user describes what they want to sell in natural language.",
		arguments: {
			filter: {
				fulltext: "horské kolo",
			},
			sort: [
				{
					field: "sort",
					order: "asc",
				},
			],
		},
	},
	{
		title: "List categories in one locale",
		description:
			"Use locale filtering when you want category labels only in a specific language for seller draft editing.",
		arguments: {
			cursor: {
				page: 0,
				size: 20,
			},
			filter: {
				locale: "cs",
			},
			sort: [
				{
					field: "group",
					order: "asc",
				},
				{
					field: "sort",
					order: "asc",
				},
			],
		},
	},
];

export const toolCategoryCollection: McpToolDefinition.Definition<
	CategoryQueryMcpSchema,
	CategoryCollectionMcpSchema
> = {
	name: "categoryCollection",
	namespace: "session",
	title: "Session Category Collection",
	description:
		"Authenticated session tool for searching and selecting listing categories before seller draft creation or publish. Use this to translate human intent into a stable categoryId. Prefer filter.fulltext when the user describes the item in natural language. See: zbav://mcp/guide/overview, zbav://mcp/guide/draft-write-flow, zbav://mcp/guide/failures, and zbav://mcp/entity/category.",
	role: "session",
	workflowHint:
		"Use before seller.draftCreate or seller.listingCreate whenever you need a categoryId from human text.",
	guideResourceUris: [
		McpSchema.withGuideResourceUri("overview"),
		McpSchema.withGuideResourceUri("draft-write-flow"),
		McpSchema.withGuideResourceUri("failures"),
	],
	profileResourceUris: [
		McpSchema.withProfileResourceUri("session.category.select"),
	],
	entityResourceUris: [
		McpSchema.withEntityResourceUri("category"),
	],
	fieldResourceUris: [
		McpSchema.withFieldResourceUri("cursor.page"),
		McpSchema.withFieldResourceUri("cursor.size"),
		McpSchema.withFieldResourceUri("category.filter.fulltext"),
		McpSchema.withFieldResourceUri("category.id"),
		McpSchema.withFieldResourceUri("category.group"),
		McpSchema.withFieldResourceUri("category.category"),
		McpSchema.withFieldResourceUri("category.slug"),
		McpSchema.withFieldResourceUri("category.locale"),
	],
	annotations: {
		title: "Session Category Collection",
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
	},
	inputSchema: CategoryQueryMcpSchema,
	outputSchema: CategoryCollectionMcpSchema,
	examples,
	execute(args) {
		const query = CategoryQuerySchema.parse(args);

		return categoryCollectionFx({
			...query,
			scope: {},
		}).pipe(
			Effect.andThen((data) =>
				zodGuardFx({
					schema: z.array(CategoryItemSchema),
					dataFx: Effect.succeed(data),
				}),
			),
			Effect.andThen((data) =>
				zodGuardFx({
					schema: CategoryCollectionMcpSchema,
					dataFx: Effect.succeed(data),
				}),
			),
		);
	},
};
