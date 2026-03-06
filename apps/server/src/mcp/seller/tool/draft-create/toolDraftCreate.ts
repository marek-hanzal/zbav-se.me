import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { draftCreateFx } from "~/@seller/draft/fx/draftCreateFx";
import { DraftCreateSchema } from "~/@seller/draft/schema/DraftCreateSchema";
import { DraftSchema } from "~/@seller/draft/schema/DraftSchema";
import { withDateFx } from "~/database/fx/withDateFx";
import { DraftCreateMcpSchema } from "~/mcp/seller/schema/DraftCreateMcpSchema";
import { DraftMcpOutputSchema, withDraftMcpOutput } from "~/mcp/seller/schema/DraftMcpOutputSchema";
import { McpSchema } from "~/mcp/McpSchema";
import type { McpToolDefinition } from "~/mcp/McpToolDefinition";

const examples: McpToolDefinition.Example<DraftCreateMcpSchema.Type>[] = [
	{
		title: "Create one complete draft in a single call",
		description:
			"Use this when you already know the listing fields, category, location, and upload ids and want a fully prepared draft immediately.",
		arguments: {
			price: 1500,
			priceType: "closed",
			condition: 3,
			age: 2,
			delivery: [
				"post",
				"package",
			],
			warranty: "no-warranty",
			restriction: "none",
			locationId: "location_prague",
			categoryId: "category_bikes",
			expiresAt: "14-days",
			title: "City bike in good condition",
			description: "Ready to ride. Stored indoors.",
			pros: [
				"Light frame",
				"New tyres",
			],
			cons: [
				"Minor scratches",
			],
			uploadIds: [
				"upload_cover",
				"upload_side",
			],
		},
	},
	{
		title: "Create a partial draft and patch later",
		description:
			"Use this when the seller only knows the basics and the rest will be filled incrementally.",
		arguments: {
			title: "Vintage lamp",
			restriction: "none",
		},
	},
];

export const toolDraftCreate: McpToolDefinition.Definition<
	DraftCreateMcpSchema,
	DraftMcpOutputSchema
> = {
	name: "draftCreate",
	namespace: "seller",
	title: "Seller Draft Create",
	description:
		"Seller-side write tool for creating a draft that can later be patched, enriched with a gallery, and published into a listing. Preserve the returned draft id because later draft patch, gallery, and publish actions depend on it. A draft can be created complete in one call or progressively patched over time. See: zbav://mcp/guide/draft-write-flow, zbav://mcp/guide/failures, zbav://mcp/entity/draft, and zbav://mcp/entity/gallery.",
	role: "seller",
	workflowHint:
		"Start seller write flow here. Preserve draft.id and decide whether to continue with progressive patching or publish once required fields are complete.",
	guideResourceUris: [
		McpSchema.withGuideResourceUri("draft-write-flow"),
		McpSchema.withGuideResourceUri("failures"),
	],
	profileResourceUris: [
		McpSchema.withProfileResourceUri("seller.draft.createComplete"),
		McpSchema.withProfileResourceUri("seller.draft.patchProgressive"),
	],
	entityResourceUris: [
		McpSchema.withEntityResourceUri("draft"),
		McpSchema.withEntityResourceUri("gallery"),
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
		McpSchema.withFieldResourceUri("draft.uploadIds"),
		McpSchema.withFieldResourceUri("draft.gallery"),
		McpSchema.withFieldResourceUri("upload.id"),
	],
	annotations: {
		title: "Seller Draft Create",
		readOnlyHint: false,
		destructiveHint: false,
		idempotentHint: false,
	},
	inputSchema: DraftCreateMcpSchema,
	outputSchema: DraftMcpOutputSchema,
	examples,
	execute(args, context) {
		const input = DraftCreateSchema.parse(args);

		return draftCreateFx({
			...input,
			userId: context.userId,
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
