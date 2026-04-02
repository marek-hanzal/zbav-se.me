import { z } from "zod";
import { FilterSchema } from "@/lib/common/schema";

export const UploadFilterSchema = z
	.looseObject({
		...FilterSchema.shape,
		userId: z.string().optional().meta({
			description: "This filter matches uploads with the exact userId",
		}),
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
