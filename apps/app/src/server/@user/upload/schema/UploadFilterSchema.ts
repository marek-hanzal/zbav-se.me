import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "~/common/schema/DefaultFilterSchema";

export const UploadFilterSchema = z
	.looseObject({
		...DefaultFilterSchema.shape,
	})
	.strip()
	.openapi("UploadFilter", {
		description: "Data for uploading a file",
	});

export type UploadFilterSchema = typeof UploadFilterSchema;

export namespace UploadFilterSchema {
	export type Type = z.infer<UploadFilterSchema>;
}
