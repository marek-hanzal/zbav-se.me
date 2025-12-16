import { z } from "@hono/zod-openapi";
import { AllowedContentTypesEnumSchema } from "~/schema/AllowedContentTypesEnumSchema";
import { AllowedExtensionsEnumSchema } from "~/schema/AllowedExtensionsEnumSchema";

export const S3PreSignRequestSchema = z.object({
	path: z.string().min(3).openapi({
		example: "/123e4567-e89b-12d3-a456-426614174000/listings/abc/gallery/photo.webp",
		description: "Object path. After stripping leading '/', must start with `<userId>/`",
	}),
	extension: AllowedExtensionsEnumSchema,
	contentType: AllowedContentTypesEnumSchema,
});

export type S3PreSignRequestSchema = typeof S3PreSignRequestSchema;

export namespace S3PreSignRequestSchema {
	export type Type = z.infer<S3PreSignRequestSchema>;
}
