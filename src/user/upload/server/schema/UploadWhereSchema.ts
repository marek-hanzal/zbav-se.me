import { z } from "zod";
import { UploadFilterSchema } from "~/user/upload/server/schema/UploadFilterSchema";

export const UploadWhereSchema = z
	.looseObject({
		...UploadFilterSchema.shape,
	})
	.strip()
	.meta({
		id: "UploadWhere",
		description: "App-based filters",
	});

export type UploadWhereSchema = typeof UploadWhereSchema;

export namespace UploadWhereSchema {
	export type Type = z.infer<UploadWhereSchema>;
}
