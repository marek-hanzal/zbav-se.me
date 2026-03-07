import { z } from "@hono/zod-openapi";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { draftCollectionFx } from "~/@seller/draft/fx/draftCollectionFx";
import { DraftQuerySchema } from "~/@seller/draft/schema/DraftQuerySchema";
import { DraftSchema } from "~/@seller/draft/schema/DraftSchema";
import { McpSchema } from "~/mcp/McpSchema";
import type { McpToolDefinition } from "~/mcp/McpToolDefinition";
import { DraftMcpOutputSchema, withDraftMcpOutput } from "~/mcp/seller/schema/DraftMcpOutputSchema";
import { DraftQueryMcpSchema } from "~/mcp/seller/schema/DraftQueryMcpSchema";

const DraftCollectionMcpSchema = z
	.array(DraftMcpOutputSchema)
	.describe("Array of seller drafts returned for the provided draft query.");

type DraftCollectionMcpSchema = typeof DraftCollectionMcpSchema;

const examples: McpToolDefinition.Example<DraftQueryMcpSchema.Type>[] = [
	{
		title: "Recently updated drafts",
		description:
			"Use updatedAt sorting when you want the seller's latest work-in-progress drafts.",
		arguments: {
			cursor: {
				page: 0,
				size: 10,
			},
			sort: [
				{
					field: "updatedAt",
					order: "desc",
				},
			],
		},
	},
	{
		title: "Only unused drafts",
		description:
			"Use usedAtIsNull=true when you want drafts that were not consumed by publish yet.",
		arguments: {
			filter: {
				usedAtIsNull: true,
			},
		},
	},
];

export const toolDraftCollection: McpToolDefinition.Definition<
	DraftQueryMcpSchema,
	DraftCollectionMcpSchema
> = {
	name: "draftCollection",
	namespace: "seller",
	title: "Seller Draft Collection",
	description:
		"Seller-side read tool for browsing, paging, and sorting seller-owned drafts. Use this when you want a list of existing drafts before patching, gallery replacement, or publish decisions. Prefer filter for public constraints and use sort for stable ordering. See: zbav://mcp/guide/overview, zbav://mcp/guide/roles, zbav://mcp/guide/draft-write-flow, zbav://mcp/guide/failures, zbav://mcp/guide/namespaces, and zbav://mcp/entity/draft.",
	role: "seller",
	workflowHint:
		"Use to review the seller's existing drafts, especially recent or still-unused drafts.",
	guideResourceUris: [
		McpSchema.withGuideResourceUri("overview"),
		McpSchema.withGuideResourceUri("roles"),
		McpSchema.withGuideResourceUri("draft-write-flow"),
		McpSchema.withGuideResourceUri("failures"),
		McpSchema.withGuideResourceUri("namespaces"),
	],
	profileResourceUris: [
		McpSchema.withProfileResourceUri("seller.draft.reviewRecent"),
		McpSchema.withProfileResourceUri("seller.draft.unused"),
	],
	entityResourceUris: [
		McpSchema.withEntityResourceUri("draft"),
		McpSchema.withEntityResourceUri("gallery"),
	],
	fieldResourceUris: [
		McpSchema.withFieldResourceUri("cursor.page"),
		McpSchema.withFieldResourceUri("cursor.size"),
		McpSchema.withFieldResourceUri("filter.id"),
		McpSchema.withFieldResourceUri("filter.idIn"),
		McpSchema.withFieldResourceUri("filter.fulltext"),
		McpSchema.withFieldResourceUri("draft.filter.updatedAtGte"),
		McpSchema.withFieldResourceUri("draft.filter.updatedAtLte"),
		McpSchema.withFieldResourceUri("draft.filter.usedAtIsNull"),
		McpSchema.withFieldResourceUri("draft.sortField"),
		McpSchema.withFieldResourceUri("sort.order"),
		McpSchema.withFieldResourceUri("draft.id"),
		McpSchema.withFieldResourceUri("draft.title"),
		McpSchema.withFieldResourceUri("draft.description"),
		McpSchema.withFieldResourceUri("draft.price"),
		McpSchema.withFieldResourceUri("draft.priceType"),
		McpSchema.withFieldResourceUri("draft.condition"),
		McpSchema.withFieldResourceUri("draft.age"),
		McpSchema.withFieldResourceUri("draft.delivery"),
		McpSchema.withFieldResourceUri("draft.warranty"),
		McpSchema.withFieldResourceUri("draft.restriction"),
		McpSchema.withFieldResourceUri("draft.locationId"),
		McpSchema.withFieldResourceUri("draft.categoryId"),
		McpSchema.withFieldResourceUri("draft.expiresAt"),
		McpSchema.withFieldResourceUri("draft.pros"),
		McpSchema.withFieldResourceUri("draft.cons"),
		McpSchema.withFieldResourceUri("draft.gallery"),
		McpSchema.withFieldResourceUri("draft.usedAt"),
	],
	annotations: {
		title: "Seller Draft Collection",
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
	},
	inputSchema: DraftQueryMcpSchema,
	outputSchema: DraftCollectionMcpSchema,
	examples,
	execute(args, context) {
		const query = DraftQuerySchema.parse(args);

		return draftCollectionFx({
			...query,
			scope: {
				userId: context.userId,
			},
		}).pipe(
			Effect.andThen((data) =>
				zodGuardFx({
					schema: z.array(DraftSchema),
					dataFx: Effect.succeed(data),
				}),
			),
			Effect.map((data) => data.map(withDraftMcpOutput)),
			Effect.andThen((data) =>
				zodGuardFx({
					schema: DraftCollectionMcpSchema,
					dataFx: Effect.succeed(data),
				}),
			),
		);
	},
};
