import { z } from "zod";
import { WhereSchema } from "@/lib/common/schema";

export const UploadWhereSchema = z
	.looseObject({
		...WhereSchema.shape,
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
