import { z } from "@hono/zod-openapi";
import { UploadSchema } from "./UploadSchema";

export const UploadDtoSchema = z
	.object({
		...UploadSchema.shape,
	})
	.omit({
		userId: true,
		createdAt: true,
	})
	.openapi("UploadDto", {
		description: "Upload data transfer object",
	});

export type UploadDtoSchema = typeof UploadDtoSchema;

export namespace UploadDtoSchema {
	export type Type = z.infer<typeof UploadDtoSchema>;
}
