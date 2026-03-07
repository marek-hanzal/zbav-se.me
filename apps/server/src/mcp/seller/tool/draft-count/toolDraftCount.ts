import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { draftCountFx } from "~/@seller/draft/fx/draftCountFx";
import { DraftCountQuerySchema } from "~/@seller/draft/schema/DraftCountQuerySchema";
import { CountSchema } from "~/schema/CountSchema";
import { McpSchema } from "~/mcp/McpSchema";
import type { McpToolDefinition } from "~/mcp/McpToolDefinition";
import { CountMcpOutputSchema } from "~/mcp/schema/CountMcpOutputSchema";
import { DraftCountQueryMcpSchema } from "~/mcp/seller/schema/DraftCountQueryMcpSchema";

const examples: McpToolDefinition.Example<DraftCountQueryMcpSchema.Type>[] = [
	{
		title: "Count still-unused drafts",
		description: "Use this when you want to know how many drafts remain unpublished.",
		arguments: {
			filter: {
				usedAtIsNull: true,
			},
		},
	},
];

export const toolDraftCount: McpToolDefinition.Definition<
	DraftCountQueryMcpSchema,
	CountMcpOutputSchema
> = {
	name: "draftCount",
	namespace: "seller",
	title: "Seller Draft Count",
	description:
		"Seller-side read tool for counting seller-owned drafts. Use this when you need totals or filtered counts before choosing a follow-up draft fetch or collection query. Prefer public filter semantics. See: zbav://mcp/guide/overview, zbav://mcp/guide/roles, zbav://mcp/guide/draft-write-flow, zbav://mcp/guide/failures, and zbav://mcp/entity/draft.",
	role: "seller",
	workflowHint:
		"Use to check whether draft data exists before collection or fetch, especially for unused drafts.",
	guideResourceUris: [
		McpSchema.withGuideResourceUri("overview"),
		McpSchema.withGuideResourceUri("roles"),
		McpSchema.withGuideResourceUri("draft-write-flow"),
		McpSchema.withGuideResourceUri("failures"),
	],
	profileResourceUris: [
		McpSchema.withProfileResourceUri("seller.draft.unused"),
	],
	entityResourceUris: [
		McpSchema.withEntityResourceUri("draft"),
	],
	fieldResourceUris: [
		McpSchema.withFieldResourceUri("draft.filter.updatedAtGte"),
		McpSchema.withFieldResourceUri("draft.filter.updatedAtLte"),
		McpSchema.withFieldResourceUri("draft.filter.usedAtIsNull"),
		McpSchema.withFieldResourceUri("count.total"),
		McpSchema.withFieldResourceUri("count.filter"),
		McpSchema.withFieldResourceUri("count.where"),
		McpSchema.withFieldResourceUri("count.isEmpty"),
		McpSchema.withFieldResourceUri("count.isFilterEmpty"),
	],
	annotations: {
		title: "Seller Draft Count",
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
	},
	inputSchema: DraftCountQueryMcpSchema,
	outputSchema: CountMcpOutputSchema,
	examples,
	execute(args, context) {
		const query = DraftCountQuerySchema.parse(args);

		return draftCountFx({
			...query,
			scope: {
				userId: context.userId,
			},
		}).pipe(
			Effect.andThen((data) =>
				zodGuardFx({
					schema: CountSchema,
					dataFx: Effect.succeed(data),
				}),
			),
			Effect.andThen((data) =>
				zodGuardFx({
					schema: CountMcpOutputSchema,
					dataFx: Effect.succeed(data),
				}),
			),
		);
	},
};
