import { FilterSchema } from "@use-pico/common/schema";
import { z } from "zod";

export const UploadFilterSchema = z
	.looseObject({
		...FilterSchema.shape,
	})
	.strip()
	.meta({
		id: "UploadFilter",
		description: "Data for uploading a file",
	});

export type UploadFilterSchema = typeof UploadFilterSchema;

export namespace UploadFilterSchema {
	export type Type = z.infer<UploadFilterSchema>;
}
