import { z } from "@hono/zod-openapi";
import { UploadFilterSchema } from "~/server/@user/upload/schema/UploadFilterSchema";

export const UploadWhereSchema = z
	.looseObject({
		...UploadFilterSchema.shape,
	})
	.strip()
	.openapi("UploadWhere", {
		description: "App-based filters",
	});

export type UploadWhereSchema = typeof UploadWhereSchema;

export namespace UploadWhereSchema {
	export type Type = z.infer<UploadWhereSchema>;
}
