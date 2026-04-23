import { z } from "zod";
import { FilterSchema } from "@/lib/common/schema";

export const UploadFilterSchema = z
	.looseObject({
		...FilterSchema.shape,
	})
	.strip()
	.meta({
		id: "PublicUploadFilter",
		description: "Public upload filters",
	});

export type UploadFilterSchema = typeof UploadFilterSchema;

export namespace UploadFilterSchema {
	export type Type = z.infer<UploadFilterSchema>;
}
