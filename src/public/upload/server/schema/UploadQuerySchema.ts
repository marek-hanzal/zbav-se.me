import { z } from "zod";
import { CursorSchema } from "@/lib/common/schema";
import { UploadSortSchema } from "~/public/upload/server/schema/UploadSortSchema";
import { UploadWhereSchema } from "~/public/upload/server/schema/UploadWhereSchema";

export const UploadQuerySchema = z
	.looseObject({
		cursor: CursorSchema.default({
			page: 0,
			size: 10,
		}).optional(),
		where: UploadWhereSchema.optional(),
		sort: UploadSortSchema.array().optional(),
		limit: z.int().nonnegative().optional().meta({
			description: "Guardrail limit for collection size",
		}),
	})
	.strip()
	.meta({
		id: "PublicUploadQuery",
		description: "Query object for public upload collection",
	});

export type UploadQuerySchema = typeof UploadQuerySchema;

export namespace UploadQuerySchema {
	export type Type = z.infer<UploadQuerySchema>;
}
