import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "../../../schema/DefaultFilterSchema";

export const UploadFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
	})
	.openapi("UploadFilter", {
		description: "User-land filters for upload items",
	});

export type UploadFilterSchema = typeof UploadFilterSchema;

export namespace UploadFilterSchema {
	export type Type = z.infer<UploadFilterSchema>;
}
