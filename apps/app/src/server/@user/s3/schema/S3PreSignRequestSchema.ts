import { z } from "zod";
import { AllowedContentTypesEnumSchema } from "~/common/schema/AllowedContentTypesEnumSchema";
import { AllowedExtensionsEnumSchema } from "~/common/schema/AllowedExtensionsEnumSchema";

export const S3PreSignRequestSchema = z
	.looseObject({
		path: z.string().min(3).meta({
			example: "/123e4567-e89b-12d3-a456-426614174000/listings/abc/gallery/photo.webp",
			description: "Object path. After stripping leading '/', must start with `<userId>/`",
		}),
		extension: AllowedExtensionsEnumSchema,
		contentType: AllowedContentTypesEnumSchema,
	})
	.strip()
	.meta({
		id: "S3PreSignRequest",
		description: "Request payload for generating a presigned S3 upload URL",
	});

export type S3PreSignRequestSchema = typeof S3PreSignRequestSchema;

export namespace S3PreSignRequestSchema {
	export type Type = z.infer<S3PreSignRequestSchema>;
}
