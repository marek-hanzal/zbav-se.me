import { z } from "@hono/zod-openapi";
import { TransactionEntryKindEnumSchema } from "~/server/database/@enum/TransactionEntryKindEnumSchema";
import { EntrySchema } from "./EntrySchema";

export const PackageSchema = z
	.looseObject({
		...EntrySchema.shape,
		kind: TransactionEntryKindEnumSchema.extract([
			"package",
		]),
		payload: z
			.looseObject({
				link: z.url().openapi({
					description: "Package tracking link",
				}),
				number: z.string().nullable().openapi({
					description: "Package tracking number",
				}),
			})
			.strip(),
	})
	.strip();

export type PackageSchema = typeof PackageSchema;

export namespace PackageSchema {
	export type Type = z.infer<PackageSchema>;
}
