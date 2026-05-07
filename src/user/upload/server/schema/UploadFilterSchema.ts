import { z } from "zod";
import { FilterSchema } from "@/lib/common/schema";
import { AccessEnumSchema } from "~/common/access/AccessEnumSchema";

export const UploadFilterSchema = z
	.looseObject({
		...FilterSchema.shape,
		userId: z.string().optional().meta({
			description: "This filter matches uploads with the exact userId",
		}),
		access: AccessEnumSchema.optional().meta({
			description: "This filter matches uploads with the exact visibility",
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
