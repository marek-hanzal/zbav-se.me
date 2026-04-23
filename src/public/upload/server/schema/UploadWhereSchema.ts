import { z } from "zod";
import { UploadFilterSchema } from "~/public/upload/server/schema/UploadFilterSchema";

export const UploadWhereSchema = z
	.looseObject({
		...UploadFilterSchema.shape,
	})
	.strip()
	.meta({
		id: "PublicUploadWhere",
		description: "Public upload app-based filters",
	});

export type UploadWhereSchema = typeof UploadWhereSchema;

export namespace UploadWhereSchema {
	export type Type = z.infer<UploadWhereSchema>;
}
