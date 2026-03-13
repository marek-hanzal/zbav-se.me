import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { withS3Fx } from "~/@common/s3/context/withS3Fx";
import { s3PreSignFx } from "~/@common/s3/fx/s3PreSignFx";
import { withUploadFx } from "~/@common/upload/context/withUploadFx";
import { S3PreSignRequestSchema } from "~/@user/s3/schema/S3PreSignRequestSchema";
import { S3PreSignResponseSchema } from "~/@user/s3/schema/S3PreSignResponseSchema";
import { McpSchema } from "~/mcp/McpSchema";
import type { McpToolDefinition } from "~/mcp/McpToolDefinition";
import { S3PreSignMcpInputSchema } from "~/mcp/user/schema/S3PreSignMcpInputSchema";
import { S3PreSignMcpOutputSchema } from "~/mcp/user/schema/S3PreSignMcpOutputSchema";
import { ServerCdnSchema } from "~/schema/env/ServerCdnSchema";
import { ServerS3Schema } from "~/schema/env/ServerS3Schema";

const examples: McpToolDefinition.Example<S3PreSignMcpInputSchema.Type>[] = [
	{
		title: "Prepare one draft image upload",
		description:
			"Use this before uploading one binary image file for a seller draft. The response does not contain an upload id yet.",
		arguments: {
			path: "listings/draft-images/cover",
			extension: "webp",
			contentType: "image/webp",
		},
	},
];

export const toolS3PreSign: McpToolDefinition.Definition<
	S3PreSignMcpInputSchema,
	S3PreSignMcpOutputSchema
> = {
	name: "s3PreSign",
	namespace: "user",
	title: "User S3 Pre-Sign",
	description:
		"Authenticated user tool for preparing a direct image upload into the private bucket. This tool returns a short-lived PUT URL and a CDN URL, but it does not create an upload id. After the binary PUT succeeds, call user.uploadCreate with the returned CDN URL. See: zbav://mcp/guide/draft-write-flow, zbav://mcp/guide/failures, and zbav://mcp/entity/upload.",
	role: "user",
	workflowHint:
		"Use before external binary upload. This is step 1 of the image flow: pre-sign -> PUT bytes -> uploadCreate -> attach upload ids.",
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
		McpSchema.withFieldResourceUri("s3.path"),
		McpSchema.withFieldResourceUri("s3.extension"),
		McpSchema.withFieldResourceUri("s3.contentType"),
		McpSchema.withFieldResourceUri("s3.url"),
		McpSchema.withFieldResourceUri("s3.cdn"),
	],
	annotations: {
		title: "User S3 Pre-Sign",
		readOnlyHint: false,
		destructiveHint: false,
		idempotentHint: false,
	},
	inputSchema: S3PreSignMcpInputSchema,
	outputSchema: S3PreSignMcpOutputSchema,
	examples,
	execute(args, context) {
		const input = S3PreSignRequestSchema.parse(args);
		const s3Config = ServerS3Schema.parse(process.env);
		const cdnConfig = ServerCdnSchema.parse(process.env);

		return s3PreSignFx({
			userId: context.userId,
			path: input.path,
			extension: input.extension,
		}).pipe(
			withS3Fx({
				api: s3Config.SERVER_S3_API,
				key: s3Config.SERVER_S3_KEY,
				secret: s3Config.SERVER_S3_SECRET,
				bucket: s3Config.SERVER_S3_BUCKET,
			}),
			withUploadFx({
				cdn: cdnConfig.SERVER_CONTENT_CDN,
			}),
			Effect.andThen((data) =>
				zodGuardFx({
					schema: S3PreSignResponseSchema,
					dataFx: Effect.succeed(data),
				}),
			),
			Effect.andThen((data) =>
				zodGuardFx({
					schema: S3PreSignMcpOutputSchema,
					dataFx: Effect.succeed(data),
				}),
			),
		);
	},
};
