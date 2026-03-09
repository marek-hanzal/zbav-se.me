import { z } from "@hono/zod-openapi";
import { BaseCreateSchema } from "./BaseCreateSchema";

export const PackageCreateSchema = z
	.looseObject({
		...BaseCreateSchema.shape,
		kind: z.literal("package"),
		payload: z.looseObject({
			link: z.url().openapi({
				description: "Package tracking link",
			}),
			number: z.string().nullable().openapi({
				description: "Package tracking number",
			}),
		}),
	})
	.openapi("TransactionEntryPackageCreate");

export type PackageCreateSchema = typeof PackageCreateSchema;

export namespace PackageCreateSchema {
	export type Type = z.infer<PackageCreateSchema>;
}
