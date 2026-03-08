import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { withUploadFx } from "~/@common/upload/context/withUploadFx";
import { uploadCreateFx } from "~/@user/upload/fx/uploadCreateFx";
import { UploadCreateSchema } from "~/@user/upload/schema/UploadCreateSchema";
import { UploadSchema } from "~/@user/upload/schema/UploadSchema";
import { withDateFx } from "~/database/fx/withDateFx";
import { McpSchema } from "~/mcp/McpSchema";
import type { McpToolDefinition } from "~/mcp/McpToolDefinition";
import { UploadCreateMcpInputSchema } from "~/mcp/user/schema/UploadCreateMcpInputSchema";
import { UploadMcpOutputSchema } from "~/mcp/user/schema/UploadMcpOutputSchema";
import { ServerCdnSchema } from "~/schema/env/ServerCdnSchema";

const examples: McpToolDefinition.Example<UploadCreateMcpInputSchema.Type>[] = [
	{
		title: "Register uploaded draft image",
		description:
			"Use this after the external PUT upload to convert the CDN URL into a stable upload id.",
		arguments: {
			url: "https://content.zbav-se.me/example/listings/draft-images/cover.webp",
		},
	},
];

export const toolUploadCreate: McpToolDefinition.Definition<
	UploadCreateMcpInputSchema,
	UploadMcpOutputSchema
> = {
	name: "uploadCreate",
	namespace: "user",
	title: "User Upload Create",
	description:
		"Authenticated user tool for registering an already uploaded file in application metadata. Use this right after a successful external PUT upload done with the user.s3PreSign response. The returned upload id is what seller draft and listing gallery tools need. See: zbav://mcp/guide/draft-write-flow, zbav://mcp/guide/failures, and zbav://mcp/entity/upload.",
	role: "user",
	workflowHint:
		"Use immediately after external binary upload. This is step 3 of the image flow: pre-sign -> PUT bytes -> uploadCreate -> attach upload ids.",
	guideResourceUris: [
		McpSchema.withGuideResourceUri("draft-write-flow"),
		McpSchema.withGuideResourceUri("failures"),
	],
	profileResourceUris: [
		McpSchema.withProfileResourceUri("seller.image.prepareUpload"),
	],
	entityResourceUris: [
		McpSchema.withEntityResourceUri("upload"),
	],
	fieldResourceUris: [
		McpSchema.withFieldResourceUri("upload.url"),
		McpSchema.withFieldResourceUri("upload.id"),
	],
	annotations: {
		title: "User Upload Create",
		readOnlyHint: false,
		destructiveHint: false,
		idempotentHint: false,
	},
	inputSchema: UploadCreateMcpInputSchema,
	outputSchema: UploadMcpOutputSchema,
	examples,
	execute(args, context) {
		const input = UploadCreateSchema.parse(args);
		const cdnConfig = ServerCdnSchema.parse(process.env);

		return uploadCreateFx({
			...input,
			userId: context.userId,
		}).pipe(
			withDateFx,
			withUploadFx({
				cdn: cdnConfig.SERVER_CONTENT_CDN,
			}),
			Effect.andThen((data) =>
				zodGuardFx({
					schema: UploadSchema,
					dataFx: Effect.succeed(data),
				}),
			),
			Effect.andThen((data) =>
				zodGuardFx({
					schema: UploadMcpOutputSchema,
					dataFx: Effect.succeed(data),
				}),
			),
		);
	},
};
