import { z } from "zod";
import { CursorSchema } from "@/lib/common/schema";
import { UploadSortSchema } from "~/user/upload/server/schema/UploadSortSchema";
import { UploadWhereSchema } from "~/user/upload/server/schema/UploadWhereSchema";

export const UploadQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		where: UploadWhereSchema.optional(),
		sort: UploadSortSchema.array().optional(),
		limit: z.int().nonnegative().optional().meta({
			description:
				"Guardrail limit for collection size; usually set/overridden by the system",
		}),
	})
	.strip()
	.meta({
		id: "UploadQuery",
		description: "Data for uploading a file",
	});

export type UploadQuerySchema = typeof UploadQuerySchema;

export namespace UploadQuerySchema {
	export type Type = z.infer<UploadQuerySchema>;
}
