import { CursorSchema } from "@use-pico/common/schema";
import { z } from "zod";
import { UploadFilterSchema } from "~/@user/upload/server/schema/UploadFilterSchema";
import { UploadSortSchema } from "~/@user/upload/server/schema/UploadSortSchema";
import { UploadWhereSchema } from "~/@user/upload/server/schema/UploadWhereSchema";

export const UploadQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: UploadFilterSchema.optional(),
		where: UploadWhereSchema.optional(),
		sort: UploadSortSchema.array().optional(),
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
