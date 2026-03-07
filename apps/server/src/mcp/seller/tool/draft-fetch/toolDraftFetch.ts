import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { draftFetchFx } from "~/@seller/draft/fx/draftFetchFx";
import { DraftQuerySchema } from "~/@seller/draft/schema/DraftQuerySchema";
import { DraftSchema } from "~/@seller/draft/schema/DraftSchema";
import { McpSchema } from "~/mcp/McpSchema";
import type { McpToolDefinition } from "~/mcp/McpToolDefinition";
import { DraftMcpOutputSchema, withDraftMcpOutput } from "~/mcp/seller/schema/DraftMcpOutputSchema";
import { DraftQueryMcpSchema } from "~/mcp/seller/schema/DraftQueryMcpSchema";

const examples: McpToolDefinition.Example<DraftQueryMcpSchema.Type>[] = [
	{
		title: "Fetch one draft by id",
		description: "Use the exact draft id when you already know which seller draft you want.",
		arguments: {
			filter: {
				id: "draft_123",
			},
		},
	},
	{
		title: "Fetch first unused draft by recent update",
		description:
			"Use this when you want one likely active draft without knowing the draft id up front.",
		arguments: {
			filter: {
				usedAtIsNull: true,
			},
			sort: [
				{
					field: "updatedAt",
					order: "desc",
				},
			],
		},
	},
];

export const toolDraftFetch: McpToolDefinition.Definition<
	DraftQueryMcpSchema,
	DraftMcpOutputSchema
> = {
	name: "draftFetch",
	namespace: "seller",
	title: "Seller Draft Fetch",
	description:
		"Seller-side read tool for retrieving one concrete seller draft. Use this when you already know the draft id or have a tightly constrained query and need one exact draft to inspect before patching, gallery replacement, or publish. Prefer filter for public constraints. See: zbav://mcp/guide/overview, zbav://mcp/guide/roles, zbav://mcp/guide/draft-write-flow, zbav://mcp/guide/failures, zbav://mcp/guide/namespaces, and zbav://mcp/entity/draft.",
	role: "seller",
	workflowHint:
		"Use when you need one exact draft to inspect or continue editing, usually before draftPatch or draftGalleryCreate.",
	guideResourceUris: [
		McpSchema.withGuideResourceUri("overview"),
		McpSchema.withGuideResourceUri("roles"),
		McpSchema.withGuideResourceUri("draft-write-flow"),
		McpSchema.withGuideResourceUri("failures"),
		McpSchema.withGuideResourceUri("namespaces"),
	],
	profileResourceUris: [
		McpSchema.withProfileResourceUri("seller.draft.fetchExact"),
		McpSchema.withProfileResourceUri("seller.draft.unused"),
	],
	entityResourceUris: [
		McpSchema.withEntityResourceUri("draft"),
		McpSchema.withEntityResourceUri("gallery"),
	],
	fieldResourceUris: [
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
		title: "Seller Draft Fetch",
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
	},
	inputSchema: DraftQueryMcpSchema,
	outputSchema: DraftMcpOutputSchema,
	examples,
	execute(args, context) {
		const query = DraftQuerySchema.parse(args);

		return draftFetchFx({
			...query,
			scope: {
				userId: context.userId,
			},
		}).pipe(
			Effect.andThen((data) =>
				zodGuardFx({
					schema: DraftSchema,
					dataFx: Effect.succeed(data),
				}),
			),
			Effect.map(withDraftMcpOutput),
			Effect.andThen((data) =>
				zodGuardFx({
					schema: DraftMcpOutputSchema,
					dataFx: Effect.succeed(data),
				}),
			),
		);
	},
};
