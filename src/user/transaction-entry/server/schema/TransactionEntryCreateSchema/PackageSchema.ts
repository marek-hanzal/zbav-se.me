import { z } from "zod";
import { TransactionEntryKindEnumSchema } from "~/common/user-transaction/enum/TransactionEntryKindEnumSchema";
import { EntrySchema } from "./EntrySchema";

export const PackageSchema = z
	.looseObject({
		...EntrySchema.shape,
		kind: TransactionEntryKindEnumSchema.extract([
			"package",
		]),
		payload: z
			.looseObject({
				link: z.url().meta({
					description: "Package tracking link",
				}),
				number: z.string().nullable().meta({
					description: "Package tracking number",
				}),
			})
			.strip(),
	})
	.strip()
	.meta({
		id: "TransactionEntryPackageCreate",
	});

export type PackageSchema = typeof PackageSchema;

export namespace PackageSchema {
	export type Type = z.infer<PackageSchema>;
}
