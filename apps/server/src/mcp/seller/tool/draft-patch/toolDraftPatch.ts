import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { draftPatchFx } from "~/@seller/draft/fx/draftPatchFx";
import { DraftPatchSchema } from "~/@seller/draft/schema/DraftPatchSchema";
import { DraftSchema } from "~/@seller/draft/schema/DraftSchema";
import { withDateFx } from "~/database/fx/withDateFx";
import { McpSchema } from "~/mcp/McpSchema";
import type { McpToolDefinition } from "~/mcp/McpToolDefinition";
import { DraftMcpOutputSchema, withDraftMcpOutput } from "~/mcp/seller/schema/DraftMcpOutputSchema";
import { DraftPatchMcpSchema } from "~/mcp/seller/schema/DraftPatchMcpSchema";

const examples: McpToolDefinition.Example<DraftPatchMcpSchema.Type>[] = [
	{
		title: "Patch title and price",
		description:
			"Use this when you only want to change a small subset of draft fields without resending the whole draft.",
		arguments: {
			draftId: "draft_123",
			patch: {
				title: "Refined seller title",
				price: 2200,
				priceType: "closed",
			},
		},
	},
];

export const toolDraftPatch: McpToolDefinition.Definition<
	DraftPatchMcpSchema,
	DraftMcpOutputSchema
> = {
	name: "draftPatch",
	namespace: "seller",
	title: "Seller Draft Patch",
	description:
		"Seller-side write tool for progressive draft editing. Use this after seller.draftCreate when the draft is being filled field-by-field or in small batches. Preserve and reuse the same draft id across the whole workflow. See: zbav://mcp/guide/draft-write-flow, zbav://mcp/guide/failures, and zbav://mcp/entity/draft.",
	role: "seller",
	workflowHint:
		"Use for incremental draft editing when the seller flow mirrors the app behavior of patching one field or a small field set at a time.",
	guideResourceUris: [
		McpSchema.withGuideResourceUri("draft-write-flow"),
		McpSchema.withGuideResourceUri("failures"),
	],
	profileResourceUris: [
		McpSchema.withProfileResourceUri("seller.draft.patchProgressive"),
	],
	entityResourceUris: [
		McpSchema.withEntityResourceUri("draft"),
	],
	fieldResourceUris: [
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
		McpSchema.withFieldResourceUri("draft.usedAt"),
		McpSchema.withFieldResourceUri("draft.gallery"),
	],
	annotations: {
		title: "Seller Draft Patch",
		readOnlyHint: false,
		destructiveHint: false,
		idempotentHint: false,
	},
	inputSchema: DraftPatchMcpSchema,
	outputSchema: DraftMcpOutputSchema,
	examples,
	execute(args, context) {
		const input = DraftPatchSchema.parse({
			patch: args.patch,
			query: {
				filter: {
					id: args.draftId,
				},
			},
		});

		return draftPatchFx({
			...input,
			scope: {
				userId: context.userId,
			},
		}).pipe(
			withDateFx,
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
