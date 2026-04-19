import { z } from "zod";
import { UploadQuerySchema } from "~/user/upload/server/schema/UploadQuerySchema";

export const UploadCountQuerySchema = z
	.looseObject({
		...UploadQuerySchema.pick({
			filter: true,
			where: true,
		}).shape,
	})
	.strip()
	.meta({
		id: "UploadCountQuery",
		description: "Query object for upload count",
	});

export type UploadCountQuerySchema = typeof UploadCountQuerySchema;

export namespace UploadCountQuerySchema {
	export type Type = z.infer<UploadCountQuerySchema>;
}
